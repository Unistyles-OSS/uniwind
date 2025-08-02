#include <jni.h>
#include "UniwindOnLoad.hpp"

JNIEXPORT jint JNICALL JNI_OnLoad(JavaVM* vm, void*) {
  return margelo::uniwind::initialize(vm);
}
