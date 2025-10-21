#!/bin/bash

yt-dlp https://feeds.acast.com/public/shows/floodcast\
    --no-config-locations\
    --paths "~/Developer/floodcast-search/data/yt-dlp/audio" --output "%(title)s.%(ext)s"\
    --write-info-json --no-write-playlist-metafiles\
    --paths "infojson:../info"\
    --restrict-filenames\
    --replace-in-metadata description "<hr><p style='color:grey; font-size:0\.75em;'> Hébergé par Acast\. Visitez <a style='color:grey;' target='_blank' rel='noopener noreferrer' href='https://acast\.com/privacy'>acast\.com/privacy</a> pour plus d'informations\.</p>$" ""\
    --parse-metadata "video::(?P<formats>)"\
    --parse-metadata "video::(?P<subtitles>)"\
    --parse-metadata "video::(?P<http_headers>)"\
    --parse-metadata "video::(?P<thumbnail>)"\
    --parse-metadata "video::(?P<thumbnails>)"\
