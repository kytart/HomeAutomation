# My home automation

```
docker build -t home-automation .
docker run -d --restart unless-stopped --name home_automation -e HEATER_IPS='<ip1>,<ip2>' -p 8080:8080 -e TZ=<timezone> home-automation
```

## Temperature

I don't have a thermostat, only electric heaters, which I made smart with TP-Link smart plugs.

This server listens for HTTP requests from an IoT device which reads temperature in the room and reports current/desired temperature.
If the temperature is lower than desired, it turns the heaters on, otherwise it turns them off. 
