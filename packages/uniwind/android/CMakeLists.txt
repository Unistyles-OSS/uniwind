project(uniwind)
cmake_minimum_required(VERSION 3.9.0)

set (PACKAGE_NAME uniwind)
set (CMAKE_VERBOSE_MAKEFILE ON)
set (CMAKE_CXX_STANDARD 20)

file(GLOB_RECURSE CORE_SRC RELATIVE ${CMAKE_SOURCE_DIR} "../cxx/**/*.cpp")
file(GLOB_RECURSE PLATFORM_SRC RELATIVE ${CMAKE_SOURCE_DIR} "./src/main/cpp/*.cpp")

# Define C++ library and add all sources
add_library(${PACKAGE_NAME} SHARED
        ${CORE_SRC}
        ${PLATFORM_SRC}
)

# Add Nitrogen specs :)
include(${CMAKE_SOURCE_DIR}/../nitrogen/generated/android/Uniwind+autolinking.cmake)

# Set up local includes
include_directories(
        "src/main/cpp"
        "../cxx/hybridObjects"
)

find_library(LOG_LIB log)

# Link all libraries together
target_link_libraries(
        ${PACKAGE_NAME}
        ${LOG_LIB}
        android                                   # <-- Android core
)
