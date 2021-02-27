//===== COPY TO CLIPBOARD =====//

// $(document).ready(function() {
//   $("div#slug").click(function() {
//     // alert("Text: " + $(this).text())
//     copyToClipboard(this)
//       // $(this).hide();
//     $(this).css({
//       color: '#70ffa9'
//     });
//     // $(this).animate({
//     //     fontSize: '.9em'
//     // });
//   });
// });

function copyToClipboard(element) {
  var $temp = $("<input>");
  $("body").append($temp);
  $temp.val($(element).text()).select();
  document.execCommand("copy");
  $temp.remove();
}


//===== CALL TWITCH API =====//

// First AJAX call for searching twitch.tv channels
$(document).ready(function() {
  $("#submit_search #user_search").click(function() {
    // $('#submit_search').on('submit', function() {
    var channel = document.getElementById('username').value;
    var tiempo = document.getElementById('tiempo').value;
    var cantidad = document.getElementById('cantidad').value;
    var userURL = `https://api.twitch.tv/kraken/clips/top?channel=${channel.toLowerCase()}&period=${tiempo}&trending=true&limit=${cantidad}`;
    $.ajax({
      url: userURL,
      type: 'GET',
      dataType: 'json',
      contentType: 'application/json',
      headers: {
        'Accept': 'application/vnd.twitchtv.v5+json',
        'Client-ID': 'njdjdkepu3gygen6rwc9lxwaio4082'
      },
      success: function(data) {
        // Multiple search without refreshing page
        // Have this before you call cloneElement() so it doesn't conflict
        // var clean = $('#clean').clone();
        // $('#clean').on('hidden.bs.modal', function() {
        //   $(this).remove();
        //   var clone = clean.clone();
        //   $('body').append(clone);
        //   $('#clean').hide();
        // });
        if (data.clips.length == 0) {
          $("div#api").html(`Acceso denegado: [ no es posible obtener los clips de este canal ]`);
          abort()
        } else {
          $("div#api").text(`Streamer: ${channel} | Clips: ${data.clips.length} | Periodo: ${tiempo} | Trending: true`);
        }

        cloneElement(data);
        // $('.list-group-item:first').hide()
        console.log(data);

        $("div #streamer-info").append(`
          <img src="${data.clips[0].broadcaster.logo}" alt="logo noitx">
          <h2>${data.clips[0].broadcaster.display_name}</h2>
          <p>UserID: ${data.clips[0].broadcaster.id}</p>
          <a href="${data.clips[0].broadcaster.channel_url}">${data.clips[0].broadcaster.channel_url}</a>
          `);

        // Clone HTML search results to display without cluttering HTML
        function cloneElement(data) {
          for (var i = 0; i < data.clips.length; i++) {

            let titulo = data.clips[i].title.substring(0,20);
            let categoria = data.clips[i].game;
            let duracion = data.clips[i].duration;
            let views = data.clips[i].views;
            let slug = data.clips[i].slug;
            let url = data.clips[i].url.split("?");
            let autor = data.clips[i].curator.display_name;

            $("div #lista-clips").append(`
              <div id="info">Titulo: <b>${titulo}...</b> | Categoria: <b>${categoria}</b> | Duracion: <b>${duracion}s</b> | Views: <b>${views}</b></div><br>
              <iframe data-src="https://clips.twitch.tv/embed?clip=${slug}&amp;parent=n0itx.github.io" frameborder="0" scrolling="no" autoplay="true" preload="metadata" allowfullscreen="true" src="https://clips.twitch.tv/embed?clip=${slug}&amp;parent=n0itx.github.io"></iframe>
              <br><div id="slug" class="info">${url[0]}</div>
              <br><div class="info">${autor}</div>
              <div class="separador pto"></div>`);
          }
        }
        $("div#slug").click(function() {
          copyToClipboard(this)
          $(this).css({
            color: '#70ffa9'
          });
        });
      }
    });
  });
});
