//===== COPY TO CLIPBOARD =====//

function copyToClipboard(element) {
  var $temp = $("<input>");
  $("body").append($temp);
  $temp.val($(element).text()).select();
  document.execCommand("copy");
  $temp.remove();
}

//===== CALL TWITCH API =====//

// AJAX call for searching twitch.tv channels
$(document).ready(function() {
  $("#submit_search #user_search").click(function() {
    var channel = document.getElementById('username').value;
    var tiempo = document.getElementById('tiempo').value;
    var cantidad = document.getElementById('cantidad').value;
    var userURL = `https://api.twitch.tv/kraken/clips/top?channel=${channel.toLowerCase()}&period=${tiempo}&trending=false&limit=${cantidad}`;
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

        if (data.clips.length == 0) {
          $("div#api").html(`0 Clips detectados en [ ${channel} / ${tiempo} / false / ${cantidad} ]`);
          return
        } else {
          $("div#api").text(`Streamer: ${channel} | Clips: ${data.clips.length} | Periodo: ${tiempo} | Trending: false`);
        }

        // console.log(data);
        // return

        cloneElement(data);

        $("div #streamer-info").append(`
          <img src="${data.clips[0].broadcaster.logo}" alt="broadcaster.logo">
          <h2>${data.clips[0].broadcaster.display_name}</h2>
          <p>UserID: ${data.clips[0].broadcaster.id}</p>
          <a href="${data.clips[0].broadcaster.channel_url}">${data.clips[0].broadcaster.channel_url}</a>
          `);

        // Clone HTML search results to display without cluttering HTML
        function cloneElement(data) {
          for (var i = 0; i < data.clips.length; i++) {

            let titulo = data.clips[i].title.substring(0, 20);
            let categoria = data.clips[i].game;
            let duracion = data.clips[i].duration;
            let views = data.clips[i].views;
            let slug = data.clips[i].slug;
            let url = data.clips[i].url.split("?");
            let autor = data.clips[i].curator.display_name;

            if (document.getElementById("dl-check").checked) {
              let id = data.clips[i].tracking_id;

              let video = data.clips[i].thumbnails.medium.replace("-preview-480x272.jpg", ".mp4")

              $("div #lista-clips").append(`
                <div id="info">Titulo: <b>${titulo}...</b> | Categoria: <b>${categoria}</b> | Duracion: <b>${duracion}s</b> | Views: <b>${views}</b></div><br>
                <video width="720" height="440" controls>
                    <source src="${video}" type="video/mp4">
                </video>
                <br><div id="slug" class="info">${url[0]}</div>
                <br><div class="info">${autor}</div>
                <div class="separador pto"></div>
              `);
            } else {
              $("div #lista-clips").append(`
                <div id="info">Titulo: <b>${titulo}...</b> | Categoria: <b>${categoria}</b> | Duracion: <b>${duracion}s</b> | Views: <b>${views}</b></div><br>
                <iframe data-src="https://clips.twitch.tv/embed?clip=${slug}&amp;parent=n0itx.github.io" frameborder="0" scrolling="no" autoplay="true" preload="metadata" allowfullscreen="true" src="https://clips.twitch.tv/embed?clip=${slug}&amp;parent=n0itx.github.io"></iframe>
                <br><div id="slug" class="info">${url[0]}</div>
                <br><div class="info">${autor}</div>
                <div class="separador pto"></div>
              `);
            }
          }
        }
      }
    });
    $("div#slug").click(function() {
      copyToClipboard(this)
      $(this).css({
        color: '#70ffa9'
      });
    });
    $(document).on("click", "#user_search", function() {
      $(".row").remove();
      $("#contenido").append(`
        <div class="row">
          <div id="lista-clips" class="column-left">
          </div>
          <div class="column-right">
            <div id="streamer-info" class="desc">
            </div>
          </div>
        </div>
      `);
    });
  });
});