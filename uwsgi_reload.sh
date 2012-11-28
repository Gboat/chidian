pid=`ps -ef|grep umtrack_fe.ini|grep -v grep|awk '{print $2}'`
if [ "$pid" = "" ] ; then
    echo "umtrack_fe uwsgi process is not running"
else
	kill -9 $pid
    echo "kill umtrack_fe uwsgi process" $pid
fi
uwsgi --ini umtrack_fe.ini
echo "start umtrack uwsgi process"
