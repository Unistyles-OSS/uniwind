#include <jni.h>
#include "UniwindOnLoad.hpp"
#include "NativeUniwindModule.hpp"

JNIEXPORT jint JNICALL JNI_OnLoad(JavaVM* vm, void*) {
  return facebook::jni::initialize(vm, [=] {
    margelo::nitro::uniwind::UniwindModule::registerNatives();
    margelo::nitro::uniwind::initialize(vm);
  });
}
