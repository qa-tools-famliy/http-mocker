rm -rf ./dist
rm -rf ./config/config.js
cp ./config/config.build.js ./config/config.js
npm run build
rm -rf ./config/config.js
cp ./config/config.develop.js ./config/config.js
echo 'build success!'
