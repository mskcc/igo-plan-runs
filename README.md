# IGO Run Planner

Show samples ready for pooling that will be placed on a sequencer.

## Dev
### Backend
```
$ ls
Makefile        README.md       assets          backend         frontend
$ cd backend
$ npm install && npm run start
```

### Frontend
```
$ ls
Makefile        README.md       assets          backend         frontend
$ cd frontend
$ npm install && npm run start
```

## Deployment
```
cd frontend
npm install && npm build
cp build ../backend/public
cd ../backend
npm install
cd -
cp -rf backend /PATH/TO/DEPLOYMENT 
```

### nginx
NOTE - the proxy timeouts are required b/c the service calls can take a long time
```
...
	location /run-planner/ {
                proxy_pass    http://127.0.0.1:3225/;
                proxy_http_version 1.1;
                proxy_set_header Upgrade $http_upgrade;
                proxy_set_header Connection 'upgrade';
                proxy_set_header Host $host;
                proxy_cache_bypass $http_upgrade;
                proxy_read_timeout 300;
                proxy_connect_timeout 300;
                proxy_send_timeout 300;
        }
...
```
