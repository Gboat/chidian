pid=`ps -ef|grep chidian.ini|grep -v grep|awk '{print $2}'`
if [ "$pid" = "" ] ; then
    echo "chidian uwsgi process is not running"
else
    kill -9 $pid
    echo "kill chidian uwsgi process" $pid
fi
uwsgi --ini chidian.ini
echo "start chidian uwsgi process"
