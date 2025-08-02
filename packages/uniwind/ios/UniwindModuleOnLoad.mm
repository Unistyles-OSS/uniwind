#import "UniwindModuleOnLoad.h"
#import <NitroModules/HybridObjectRegistry.hpp>
#import "HybridUniwindRuntime.hpp"

using namespace margelo::nitro;

@implementation UniwindModule

RCT_EXPORT_MODULE(Uniwind)

+ (BOOL)requiresMainQueueSetup {
    return YES;
}

- (void)installJSIBindingsWithRuntime:(jsi::Runtime&)rt callInvoker:(const std::shared_ptr<facebook::react::CallInvoker> &)callInvoker {
    // function is called on: first init and every live reload
    // check if this is live reload, if so let's replace with new runtime
    auto hasUniwindRuntime = HybridObjectRegistry::hasHybridObject("UniwindRuntime");

    if (hasUniwindRuntime) {
        HybridObjectRegistry::unregisterHybridObjectConstructor("UniwindRuntime");
    }

    
    [self createHybrids:rt callInvoker:callInvoker];
}

- (void)createHybrids:(jsi::Runtime&)rt callInvoker:(const std::shared_ptr<facebook::react::CallInvoker> &)callInvoker {
    auto runOnJSThread = [callInvoker](std::function<void(jsi::Runtime& rt)> &&callback){
        callInvoker->invokeAsync(std::move(callback));
    };

// TODO: Add Swift and Kotlin Platform
//    auto nativePlatform = Uniwind::NativePlatform::create().getCxxPart();
//    auto uniwindRuntime = std::make_shared<HybridUniwindRuntimeSpec>(nativePlatform, rt, runOnJSThread);
    auto uniwindRuntime = std::make_shared<uniwind::HybridUniwindRuntime>();

    HybridObjectRegistry::registerHybridObjectConstructor("UniwindRuntime", [uniwindRuntime]() -> std::shared_ptr<HybridObject>{
        return uniwindRuntime;
    });
}

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:(const facebook::react::ObjCTurboModule::InitParams &)params {
    return std::make_shared<facebook::react::NativeTurboUniwindSpecJSI>(params);
}

- (void)invalidate {
    [super invalidate];
}

@end
