PWD=`pwd`

./restart.sh 8010 8011 8012 8013 8014 8015 8016 8017 8018 8019 8020 8021 8022 8023 8024 8025 8026 8027 8028 8029 8030
pkill -f "status_all.py"
sleep 2
cd ../control/ && ./start_status.sh &
cd $PWD