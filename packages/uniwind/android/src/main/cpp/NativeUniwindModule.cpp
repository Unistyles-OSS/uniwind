#include "NativeUniwindModule.hpp"
#import <NitroModules/HybridObjectRegistry.hpp>
#import "HybridUniwindRuntime.hpp"

using namespace margelo::nitro::uniwind;
using namespace facebook::react;

UniwindModule::UniwindModule(
    jni::alias_ref<UniwindModule::jhybridobject> jThis,
    jni::alias_ref<react::JRuntimeExecutor::javaobject> runtimeExecutorHolder
):  _runtimeExecutor(runtimeExecutorHolder->cthis()->get()) {}

jni::local_ref<UniwindModule::jhybriddata> UniwindModule::initHybrid(
    jni::alias_ref<UniwindModule::jhybridobject> jThis,
    jni::alias_ref<JRuntimeExecutor::javaobject> runtimeExecutorHolder
) {
    return makeCxxInstance(jThis, runtimeExecutorHolder);
}

void UniwindModule::registerNatives() {
    javaClassStatic()->registerNatives({
        makeNativeMethod("getBindingsInstaller", UniwindModule::getBindingsInstaller),
        makeNativeMethod("initHybrid", UniwindModule::initHybrid),
        makeNativeMethod("invalidateNative", invalidateNative),
    });
}

jni::local_ref<BindingsInstallerHolder::javaobject> UniwindModule::getBindingsInstaller(jni::alias_ref<UniwindModule::javaobject> jobj) {
    auto& runtimeExecutor = jobj->cthis()->_runtimeExecutor;

    return BindingsInstallerHolder::newObjectCxxArgs([&runtimeExecutor](jsi::Runtime& rt) {
        // function is called on: first init and every live reload
        // check if this is live reload, if so let's replace UniwindRuntime with new runtime
        auto hasUniwindRuntime = HybridObjectRegistry::hasHybridObject("UniwindRuntime");

        if (hasUniwindRuntime) {
            HybridObjectRegistry::unregisterHybridObjectConstructor("UniwindRuntime");
        }

        auto runOnJSThread = [&runtimeExecutor](std::function<void(jsi::Runtime&)>&& callback) {
            runtimeExecutor([callback = std::move(callback)](jsi::Runtime &rt) {
                callback(rt);
            });
        };

        // init hybrids
        // auto uniwindRuntime = std::make_shared<HybridUniwindRuntime>(nativePlatform, rt, runOnJSThread);
        auto uniwindRuntime = std::make_shared<HybridUniwindRuntime>();

        HybridObjectRegistry::registerHybridObjectConstructor("UniwindRuntime", [uniwindRuntime]() -> std::shared_ptr<HybridObject>{
            return uniwindRuntime;
        });
    });
}