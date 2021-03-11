const client = new tmi.Client({
  options: {
    debug: false,
    messagesLogLevel: "info"
  },
  connection: {
    reconnect: true,
    secure: true
  },
  identity: {
    username: 'zhokro',
    password: 'oauth:upzcq1esih74udaj29c04vw1tj4g9r'
  },
  channels: ['zhokro']
});

let join_to = [
  'soypan', 'nuvia_ouo', 'xxkeivicxx', 'alicejuliana', 'caprimint',
  'elded', 'iaaras2', 'conterstine', 'juansguarnizo', 'xcry',
  'n0itx', 'twitch', 'rubius', 'drdianaa', 'cateVinelle',
  'catsen'
  /*, 'sapharic', 'sacriel', 'Sparkles_qt', 'inochifantasy',
    'scrubing', 'missgigglesss', 'nakkida', 'andy', 'fpskrystal',
    'landfork', 'asleepypeach', 'donnaybunny', 'pictobeam', 'teepee',
    'nozomi', 'chun', 'diffizzle', 'leonie', 'brionuhh',
    'kohrean', 'bobbypoffgaming', 'chillbobagginz', 'aylaahmao',
    'spekel', 'gooderness', 'jessekiri', 'lillyvinnily',
    'lloulou', 'choi', 'nuubix', 'maimy', 'galaxyaus', 'mizkif',
    'brookeab', 'ciriell', 'neeko', 'JoeWatermelon', 'lilypichu',
    'kephrii', 'inkspirate', 'admiralbahroo', 'syndicate',
    'tsikyo', 'dreamt', 'niisa', 'neko', 'forgottenproject',
    'nikatine', 'jinja', 'smexi', 'imtedious', 'august',
    'spofie', 'sacredxo', 'leyla', 'jaee', 'tenz',
    'umbra', 'pointcrow', 'tfue', 'summit1g', 'bugha', 'dubs', 'bizzle',
    'imnio'*/
];

function conectar() {
  client.connect().catch(console.error);
}

function desconectar() {
  client.disconnect().catch(console.error)
}

// client.connect().catch(console.error);

client.on('connected', connection);
client.on('disconnected', disconnection);
client.on('message', chat_messages);

function disconnection(reason) {
  console.log(`* Disconnction by: ${reason}`);
  $('.connection').css('textShadow', '#ff0000 0 0 10px');
  $('.connection').text(`DISCONECTED`);
}

function connection(addr, port) {
  console.log(`* Connected to ${addr}:${port}`);
  $('.connection').css('textShadow', '#3fff00 0 0 10px');
  $('.connection').text(`ONLINE`);

  JoinTo();
}

function JoinTo() {
  let time = 0;
  const pta = setInterval(() => {
    client.join(join_to[time])
      .then((data) => {
        join_Cannels(data[0].replace('#', ''))
      });
    time++;
    if (time == join_to.length) {
      clearInterval(pta)
    }
  }, 1000);
}

async function join_Cannels(nick) {
  const resp = await API_User(nick);
  card_JL(resp, true)

}

//===== HTML CARDS =====//

function card_JL(nick, join) {
  let tipo = join ? 'join' : 'left';
  let date = new Date();
  $("#JL-channel").prepend(`
    <div class="JL">
      <img src="${nick.logo}" alt="">
      <div class="info ${tipo}">
        <span class="nick">${nick.display_name}</span>
        <span class="hora">${date.getHours()}:${date.getMinutes()}</span>
      </div>
    </div>
  `);
  removeExedent('JL', 15);
}

//===== TWITCH API V5 =====//

function API_User(nick) {
  return new Promise(resolve => {
    $.ajax({
      url: `https://api.twitch.tv/kraken/users?login=${nick}`,
      type: 'GET',
      dataType: 'json',
      contentType: 'application/json',
      headers: {
        'Accept': 'application/vnd.twitchtv.v5+json',
        'Client-ID': 'njdjdkepu3gygen6rwc9lxwaio4082'
      },
      success: function(data) {
        $.ajax({
          url: `https://api.twitch.tv/kraken/channels/${data.users[0]._id}`,
          type: 'GET',
          dataType: 'json',
          contentType: 'application/json',
          headers: {
            'Accept': 'application/vnd.twitchtv.v5+json',
            'Client-ID': 'njdjdkepu3gygen6rwc9lxwaio4082'
          },
          success: function(data2) {
            resolve(data2);
          }
        });
      }
    });
  });
}

const ignore_nick = 'nightbot,streamelements,xkvbotx';

//===== CHAT =====//
function chat_messages(chs, usr, msg, self) {
  const username = usr['username'];
  const nick = usr['display-name'];
  chs = chs.replace('#', '')

  if (ignore_nick.includes(username)) {
    // console.log(`${username} detectado`)
    return;
  }
  // console.log(`${chs} - ${nick}: ${msg}`)
  // $("#chat").prepend(`
  //   <p class="mensaje">${chs} - ${nick}: ${msg}</p>
  // `);
  message_card(nick, msg);
  removeExedent('mensaje', 15);
}
//https://static-cdn.jtvnw.net/emoticons/v2/881956/default/light/1.0

function message_card (nick, msg) {
  if (msg.includes('LUL')) {
    $(this).css(
      'background-color', '#8500ff'
    );
  }
  $("#chat").prepend(`
    <p class="mensaje">${nick}: ${msg}</p>
  `);
}


//===== EXTRAS =====//

function removeExedent(name, cantidad) {
  const elements = document.getElementsByClassName(name);
  if (elements.length == cantidad + 1)
    elements[cantidad].parentNode.removeChild(elements[cantidad]);
}