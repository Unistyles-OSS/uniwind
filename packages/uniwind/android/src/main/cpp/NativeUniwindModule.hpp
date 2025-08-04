#pragma once

#include <ReactCommon/BindingsInstallerHolder.h>
#include <react/jni/JRuntimeExecutor.h>
#include <react/renderer/scheduler/Scheduler.h>
#include <fbjni/fbjni.h>
#include <react/fabric/Binding.h>

namespace margelo::nitro::uniwind {

using namespace facebook;
using namespace facebook::react;

struct UniwindModule : public jni::HybridClass<UniwindModule> {
    static constexpr auto kJavaDescriptor = "Lcom/uniwind/UniwindModule;";

    explicit UniwindModule(
        jni::alias_ref<jhybridobject> jThis,
        jni::alias_ref<react::JRuntimeExecutor::javaobject> runtimeExecutorHolder
    );

    static void registerNatives();
    static jni::local_ref<jhybriddata> initHybrid(
        jni::alias_ref<jhybridobject> jThis,
        jni::alias_ref<JRuntimeExecutor::javaobject> runtimeExecutorHolder
    );
    static void invalidateNative(jni::alias_ref<jhybridobject> jThis) {
        // todo
    }

    static jni::local_ref<BindingsInstallerHolder::javaobject> getBindingsInstaller(jni::alias_ref<UniwindModule::javaobject> jThis);

private:
    RuntimeExecutor _runtimeExecutor;
};

}