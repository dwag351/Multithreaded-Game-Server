using System;
using System.Net;
using System.Net.Sockets;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading;

[System.Serializable]
public class Player
{
    public string name;
    public TcpClient networkClient;
}

[System.Serializable]
public class MatchMaking
{
    public Player hostPlayer;
    public string gameID;
}

[System.Serializable]
public class Match
{
    public Player playerOne;
    public Player playerTwo;
    public string gameID;
    public string gameState;
    public string lastMove;
}

class Server {
    // Keeps track of all the number of connected players.
    public static int numberOfUsers = 0;

    // Keep track of all the connected players.
    public static List<Player> registry = new List<Player>();

    // List of all the possible names. For this server there is only 10 possible names.
    public static List<string> availableNames = new List<string>() { "Tokyo", "Delhi", "Shanghai", "Sao Paulo", "Mexico City", "Cairo", "Mumbai", "Beijing", "Dhaka", "Osaka" };

    // List of all MatchMaking objects. This helps keep track of which players are waiting to start their games.
    public static List<MatchMaking> lookingForMatch = new List<MatchMaking>();

    // List of all Matches. This helps keep track of all ongoing matches.
    public static List<Match> matches = new List<Match>();
    
    public static void Main() {
        // By default, the IP of this server is "localhost" and the port is 8080.
        string ip = "127.0.0.1";
        int port = 8080;
        
        // We start by creating a TcpListener to look out for player connections.
        var server = new TcpListener(IPAddress.Parse(ip), port);
        server.Start();
        Console.WriteLine("Listening at {0}:{1}", ip, port);
        
        Player player;

        // While the server is running, this while loop will run on forever. We need to do this so we can pick up new players
        // at any time while the server is running.
        while (true)
        {
            // When a new player has joined, we create for them a new Player object which will be given to the thread managing their processes.
            player = new Player();
            player.networkClient = server.AcceptTcpClient();
            ThreadPool.QueueUserWorkItem(ThreadProc, player);
            numberOfUsers++;
            registry.Add(player);
        }
    }

    private static void ThreadProc(object obj)
    { 
        // Here we set up some useful variables which are needed later on in this thread.
        var player = (Player)obj;
        string name = availableNames[0];
        string opponentName = "";
        string gameID = null;
        Match currentMatch = new Match();
        player.name = name;

        // Here we are getting the IP, port and thread number for the given player connection.
        string ip = ((IPEndPoint)player.networkClient.Client.RemoteEndPoint).Address.ToString();
        string port = ((IPEndPoint)player.networkClient.Client.RemoteEndPoint).Port.ToString();
        string threadID = Thread.CurrentThread.ManagedThreadId.ToString();

        // Now we can remove the name from the list of possible names and display to the console our new player connection.
        availableNames.RemoveAt(0);
        Console.WriteLine("Connection established with {0}:{1}", ip, port);
        
        NetworkStream stream = player.networkClient.GetStream();

        // We need a while loop which runs forever here so the thread can keep serving the player for as long as they are connected.
        while (true)
        {
            while (!stream.DataAvailable)
            {
                // Checking if the player is still connected to the server.
                if (stream.Socket.Poll(1000, SelectMode.SelectRead) & stream.Socket.Available == 0)
                {
                    // If they are no longer connected we will display this in the console and close this thread.
                    Console.WriteLine("Thread {0} closing connection with {1}:{2} and terminating", threadID, ip, port);
                    
                    numberOfUsers -= 1;
                    availableNames.Add(name);
                    registry.Remove(player);
                    
                    // If the player has connected to an opponents game, then we have to remove the match.
                    if (gameID != null && opponentName != "")
                    {
                        int index = matches.FindIndex(s => s == currentMatch);
                        matches.RemoveAt(index);
                    }

                    // If the player hasn't connected to a match but is instead waiting for one, we remove them from the waiting queue.
                    if (gameID != null && opponentName == "")
                    {
                        int index = lookingForMatch.FindIndex(s => s.gameID == gameID);
                        lookingForMatch.RemoveAt(index);
                    }

                    // If the player disconnects then we close this thread.
                    return;
                }
            }

            // Now we wait for the player to send a message.
            while (player.networkClient.Available < 3);

            // Once the message has been received we can start processing it.
            byte[] bytes = new byte[player.networkClient.Available];
            stream.Read(bytes, 0, player.networkClient.Available);
            string s = Encoding.UTF8.GetString(bytes);

            // The player must first estabilish its proper connection to the server via a handshake, thats what this
            // first if statement is for.
            if (Regex.IsMatch(s, "^GET", RegexOptions.IgnoreCase))
            {
                string swk = Regex.Match(s, "Sec-WebSocket-Key: (.*)").Groups[1].Value.Trim();
                string swka = swk + "258EAFA5-E914-47DA-95CA-C5AB0DC85B11";
                byte[] swkaSha1 = System.Security.Cryptography.SHA1.Create().ComputeHash(Encoding.UTF8.GetBytes(swka));
                string swkaSha1Base64 = Convert.ToBase64String(swkaSha1);
                byte[] response = Encoding.UTF8.GetBytes(
                    "HTTP/1.1 101 Switching Protocols\r\n" +
                    "Connection: Upgrade\r\n" +
                    "Upgrade: websocket\r\n" +
                    "Sec-WebSocket-Accept: " + swkaSha1Base64 + "\r\n\r\n");
                // The server will respond accordingly to this handshake request.
                stream.Write(response, 0, response.Length);
            }
            // Now we can deal with every other type of message sent to the server.
            else
            {
                // These variables are important as we need them to process the message further down in this thread.
                bool fin = (bytes[0] & 0b10000000) != 0,
                    mask = (bytes[1] & 0b10000000) != 0;
                int opcode = bytes[0] & 0b00001111,
                    offset = 2;
                ulong msglen = (ulong)(bytes[1] & 0b01111111);
                
                if (mask)
                {
                    byte[] decoded = new byte[msglen];
                    byte[] masks = new byte[4] { bytes[offset], bytes[offset + 1], bytes[offset + 2], bytes[offset + 3] };
                    offset += 4;

                    for (ulong i = 0; i < msglen; ++i)
                        decoded[i] = (byte)(bytes[offset + (byte)i] ^ masks[i % 4]);

                    // After the processsing is complete we now have the message in a string format.
                    string text = Encoding.UTF8.GetString(decoded);
                    
                    // The first thing a player should do once they are connected is to register themself within the server. This if
                    // statement is designed for this purpose.
                    if (text.Contains("/register"))
                    {
                        // When the player joins they are automatically given a name in the server, but we still need to send them their name
                        // so they are aware of what they are called.
                        byte[] response = encodeMessage("/register?" + name);
                        stream.Write(response, 0, response.Length);

                        // We print to the console that our new player is registered.
                        Console.WriteLine("Thread {0} sent response to {1}:{2} for {3}", threadID, ip, port, text);
                    }
                    // Once registered, our player will want to be paired with another player. There are three outcomes of this type of a message.
                    // Outcome One: there are no other players to be paired up, thus this player must wait and be put into the queue.
                    // Outcome Two: there is another player already waiting, thus we must pair up this player and that other player.
                    // Outcome Three: the player is already paired up, but is using this message to make sure the other player is still connected to the server.
                    else if (text.Contains("/pairme?player=" + name))
                    {
                        // First we will check for Outcome Two.
                        if (lookingForMatch.Count > 0 && gameID == null)
                        { // Match the two players. Our player in this thread is player two.
                            opponentName = lookingForMatch.ElementAt(0).hostPlayer.name;
                            gameID = lookingForMatch.ElementAt(0).gameID;

                            // Tell the player their opponent's name, as well as the game ID.
                            byte[] response = encodeMessage("/pairme?player=(" + opponentName + ", " + name + ", " + gameID + ", progess)");
                            stream.Write(response, 0, response.Length);

                            // Officially create the match between player one and two.
                            currentMatch.playerOne = lookingForMatch.ElementAt(0).hostPlayer;
                            currentMatch.playerTwo = player;
                            currentMatch.gameID = gameID;
                            currentMatch.gameState = "progress";
                            currentMatch.lastMove = "-1";
                            matches.Add(currentMatch);

                            // Remove player one from match making queue.
                            lookingForMatch.RemoveAt(0);
                        }
                        // Then we check for Outcome One.
                        else if (gameID == null)
                        { // Create new game instance.
                            gameID = Guid.NewGuid().ToString();

                            MatchMaking newMatchMaking = new MatchMaking();
                            newMatchMaking.gameID = gameID;
                            newMatchMaking.hostPlayer = player;

                            // Add the player to the match making queue.
                            lookingForMatch.Add(newMatchMaking);
                            
                            // Tell the player that they are indeed player one. Also give them a new gameID.
                            byte[] response = encodeMessage("/pairme?player=(" + name + ", , " + gameID + ", wait)");
                            stream.Write(response, 0, response.Length);
                        }
                        // Finally, we assume Outcome Three.
                        else
                        { // update current match.
                            try
                            { // We go through all the ongoing matches and see if there is one which matches this threads match.
                                foreach (Match match in matches)
                                {
                                    if (match.gameID == gameID)
                                    {
                                        currentMatch = match;

                                        // Tell the player that the other is here and ready.
                                        byte[] response = encodeMessage("/pairme?player=(" + currentMatch.playerOne.name + ", " + currentMatch.playerTwo.name + ", " + currentMatch.gameID + ", " + currentMatch.gameState + ")");
                                        stream.Write(response, 0, response.Length);
                                    }
                                }
                                Console.WriteLine("Thread {0} sent response to {1}:{2} for {3}", threadID, ip, port, text);
                            } catch
                            {
                                Console.WriteLine("Thread {0} suffered an error", threadID);
                            }
                        }
                    }
                    else if (text.Contains("/mymove?player=" + name + "&id=" + gameID + "&move="))
                    { // We don't check if this is a valid move, we only process it as if it is.

                        try
                        { // Here we can find the correct match and update its last move with this new move.
                            int index = matches.FindIndex(s => s == currentMatch);
                            currentMatch = matches[index];
                            currentMatch.lastMove = text.Split("=").Last();
                            matches[index] = currentMatch;
                            Console.WriteLine("Thread {0} sent response to {1}:{2} for {3}", threadID, ip, port, text);
                        } catch
                        {
                            Console.WriteLine("Thread {0} suffered an error", threadID);
                        }
                        
                    }
                    else if (text.Contains("/theirmove?player=" + name + "&id=" + gameID))
                    {
                        try
                        { // Here we will deliver the last move of the other player. This also assumes that the other move is the current last move
                            // which may not always be true.
                            foreach (Match match in matches)
                            {
                                if (match.gameID == gameID)
                                {
                                    // Retrieve the match's last move.
                                    byte[] response = encodeMessage("/lastmove?" + match.lastMove);
                                    stream.Write(response, 0, response.Length);
                                }
                            }
                            Console.WriteLine("Thread {0} sent response to {1}:{2} for {3}", threadID, ip, port, text);
                        } catch
                        {
                            Console.WriteLine("Thread {0} suffered an error", threadID);
                        }                        
                    }
                }
            }
        }

    }

    // This function is called when we are wanting to send a message back to the player as we must encode every message getting sent.
    static byte[] encodeMessage(string msg)
    {
        int msgLength = msg.Length;

        if (msgLength <= 125)
        {
            byte[] msgEncoded = new byte[msgLength + 2];

            msgEncoded[0] = 0x81;
            msgEncoded[1] = (byte)msgLength;

            for (int i = 0; i < msgLength; i++)
            {
                msgEncoded[i + 2] = (byte)msg[i];
            }

            return msgEncoded;
        } else
        {

            byte[] msgEncoded = new byte[msgLength + 4];

            msgEncoded[0] = 0x81;
            msgEncoded[1] = 126;
            msgEncoded[2] = (byte)((byte)msgLength >> 8);
            msgEncoded[3] = (byte)msgLength;

            for (int i = 0; i < msgLength; i++)
            {
                msgEncoded[i + 4] = (byte)msg[i];
            }

            return msgEncoded;
        }
    }
}