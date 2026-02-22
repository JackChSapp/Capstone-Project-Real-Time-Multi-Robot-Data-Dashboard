FROM ros:jazzy-ros-base

# Explicitly set the shell to handle errors correctly
SHELL ["/bin/bash", "-c"]

# Add OSRF apt repository
RUN apt-get update && apt-get install -y curl gnupg lsb-release \
    && curl https://packages.osrfoundation.org/gazebo.gpg \
       --output /usr/share/keyrings/pkgs-osrf-archive-keyring.gpg \
    && echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/pkgs-osrf-archive-keyring.gpg] \
       http://packages.osrfoundation.org/gazebo/ubuntu-stable \
       $(lsb_release -cs) main" \
       > /etc/apt/sources.list.d/gazebo-stable.list

# Install the bridge
# We verify the package name is 'ros-jazzy-foxglove-bridge' per the docs
RUN apt-get update && apt-get install -y \
    ros-jazzy-foxglove-bridge \
    ros-jazzy-ros-gz \
    gz-harmonic \
    python3-colcon-common-extensions \
    && rm -rf /var/lib/apt/lists/*

# # Source ROS setup in the entrypoint so the bridge can find ROS nodes
# ENTRYPOINT ["/bin/bash", "-c", "source /opt/ros/jazzy/setup.bash && exec \"$@\"", "--"]

# # Set the default launch command
# CMD ["ros2", "launch", "foxglove_bridge", "foxglove_bridge_launch.xml"]

# Source ROS automatically in every shell
RUN apt-get update && apt-get install -y \
    ros-jazzy-ros-gz \
    ros-jazzy-foxglove-bridge \
    ros-jazzy-ros-gz-bridge \
    ros-jazzy-ros-gz-sim \
    ros-jazzy-geometry-msgs \
    ros-jazzy-sensor-msgs \
    ros-jazzy-nav-msgs \
    ros-jazzy-tf2-ros \
    gz-harmonic \
    python3-colcon-common-extensions \
    && rm -rf /var/lib/apt/lists/*

# Clone ONLY the packages we need - simulations and description
RUN mkdir -p /ros_ws/src && cd /ros_ws/src \
    && git clone -b jazzy https://github.com/ROBOTIS-GIT/turtlebot3_simulations.git \
    && git clone -b jazzy https://github.com/ROBOTIS-GIT/turtlebot3.git

# Build only the packages we actually need, skipping the rest
RUN cd /ros_ws \
    && source /opt/ros/jazzy/setup.bash \
    && colcon build --symlink-install \
       --packages-select \
       turtlebot3_description \
       turtlebot3_common \
       turtlebot3_gazebo

RUN echo "source /opt/ros/jazzy/setup.bash" >> ~/.bashrc \
    && echo "source /ros_ws/install/setup.bash" >> ~/.bashrc \
    && echo "export TURTLEBOT3_MODEL=burger" >> ~/.bashrc

WORKDIR /ros_ws

COPY entrypoint.sh /entrypoint.sh
RUN sed -i 's/\r//' /entrypoint.sh && chmod +x /entrypoint.sh

WORKDIR /ros_ws
ENTRYPOINT ["/entrypoint.sh"]
