#!/bin/bash
set -e

source /opt/ros/jazzy/setup.bash
source /ros_ws/install/setup.bash
export TURTLEBOT3_MODEL=burger
export GZ_SIM_RESOURCE_PATH=/ros_ws/install/turtlebot3_gazebo/share/turtlebot3_gazebo/models:/ros_ws/install/turtlebot3_common/share/turtlebot3_common:ros_ws/install/turtlebot3_gazebo/share/turtlebot3_gazebo/models/turtlebot3_waffle

# Start Gazebo server in background
gz sim -v4 -s -r --headless-rendering /ros_ws/worlds/empty.sdf &

echo "Waiting for Gazebo to initialize..."
sleep 10

# Start the ROS-GZ bridge
ros2 run ros_gz_bridge parameter_bridge \
  --ros-args -p config_file:=/ros_ws/bridge/turtlebot3_bridge.yaml &

sleep 2

# Start H.264 compressed video transport for the camera image
# This exposes an image_transport \"foxglove\" plugin which will publish
# a CompressedVideo topic alongside /robot1/camera/image_raw.
#
# foxglove_bridge will automatically discover and forward the compressed stream,
# allowing Foxglove Studio to subscribe to the H.264 feed.
ros2 run image_transport republish \
  raw in:=/robot1/camera/image_raw \
  foxglove out:=/out/foxglove &

sleep 2

# Start Foxglove bridge
ros2 launch foxglove_bridge foxglove_bridge_launch.xml \
  port:=8765 address:=0.0.0.0

