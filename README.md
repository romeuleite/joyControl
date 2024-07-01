# PathPursuit Mobile Application

The PathPursuit Mobile Application, built with React Native, offers a multiplatform interface for robot interaction. It leverages the Robot Operating System (ROS) middleware and the RosBridge driver to establish a WebSocket connection. The app’s primary function is to provide a joystick control for the robot’s movement and enable autonomous navigation through waypoint settings, using the A* Path Planner and the Pure Pursuit Controller.

## Features

### Screen 1: ROS Connection and Joystick Control
On the first screen , users connect to ROS using WebSocket by inputting the IP address of the network where their ROS system and PathPursuit app are operational. After the initial setup, users can adjust the robot’s linear and angular velocities and steer it using the joystick. The joystick operation sends speed commands to the robot through the ROS `/cmd_vel` topic.

![IMG-20240214-WA0019](https://github.com/romeuleite/joyControl/assets/119366384/b2a0cf26-a419-4314-9bc9-e709ffc230cf)

![IMG-20240214-WA0011](https://github.com/romeuleite/joyControl/assets/119366384/2eeaf3fd-9214-4100-983a-a8bd17f2ee09)

### Screen 2: Waypoint Navigation
On the second screen , users have the option to select a pre-saved waypoint for the robot to navigate towards or to record a new waypoint. The ROS `/odom` topic is employed to capture the robot’s odometry and save it as a waypoint if the user opts to record a new one. A custom ROS topic, `/set_waypoint`, is used to transmit the selected waypoint to the ROS system for navigation. The system processes the waypoint coordinates and employs the A* path planner and Pure Pursuit Controller to enable the robot’s autonomous navigation towards the waypoint.

![IMG-20240214-WA0018](https://github.com/romeuleite/joyControl/assets/119366384/a4c7bfd3-5b07-43a8-ac38-81155f3e9733)

![IMG-20240214-WA0016](https://github.com/romeuleite/joyControl/assets/119366384/af65ae14-adc0-42b3-884d-cff56b3e1b94)

![IMG-20240214-WA0010](https://github.com/romeuleite/joyControl/assets/119366384/eca8700f-37b6-4c7d-94e9-7f274ce003d3)

## Related Projects
The project was developed in conjunction with the [Trajectory-Planning-and-Autonomous-Navigation-ROS](https://github.com/Gabertho/Trajectory-Planning-and-Autonomous-Navigation-ROS.git) projetc.

