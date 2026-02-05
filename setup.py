import os
from glob import glob
from setuptools import setup

package_name = 'Capstone Robot Dashboard'

setup(
    name=package_name,
    version='0.0.1',
    # Packages to export
    packages=[package_name],
    # Files we want to install, specifically launch files
    data_files=[
        # Install marker file in the package index
        ('share/ament_index/resource_index/packages', ['resource/' + package_name]),
        # Include our package.xml file
        (os.path.join('share', package_name), ['package.xml']),
        # Include all launch files.
        (os.path.join('share', package_name, 'launch'), glob(os.path.join('launch', '*.launch.py'))),
    ],
    # This is important as well
    install_requires=['setuptools'],
    zip_safe=True,
    author='Hussam Abubakr, Jeana Chapman, Emiliano de la Garza, Jewel Littlefield, Jack Sapp, Hayla Turney',
    #Please everyone put their emails here
    author_email='Jackchsapp@gmail.com',
    maintainer='Dr. Gokhan Erdemir',
    maintainer_email='gokhan-erdemir@utc.edu',
    keywords=['foo', 'bar'],
    classifiers=[
        'Intended Audience :: Developers',
        'License :: TODO',
        'Programming Language :: Python',
        'Topic :: Software Development',
    ],
    description='Robot Dashboard for interfacing with various ROS and ROS2 robots.',
    license='TODO',
    # Like the CMakeLists add_executable macro, you can add your python
    # scripts here.
    entry_points={
        'console_scripts': [
            'my_script = my_package.my_script:main'
        ],
    },
)