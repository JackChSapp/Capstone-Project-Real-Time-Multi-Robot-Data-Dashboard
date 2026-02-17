FROM ros:jazzy-ros-base

# Explicitly set the shell to handle errors correctly
SHELL ["/bin/bash", "-c"]

# Install the bridge
# We verify the package name is 'ros-jazzy-foxglove-bridge' per the docs
RUN apt-get update && apt-get install -y \
    ros-jazzy-foxglove-bridge \
    && rm -rf /var/lib/apt/lists/*

# Source ROS setup in the entrypoint so the bridge can find ROS nodes
ENTRYPOINT ["/bin/bash", "-c", "source /opt/ros/jazzy/setup.bash && exec \"$@\"", "--"]

# Set the default launch command
CMD ["ros2", "launch", "foxglove_bridge", "foxglove_bridge_launch.xml"]