#pragma once

#ifndef RCT_NEW_ARCH_ENABLED
    #error "Uniwind Pro requires your project to have New Architecture enabled."
#endif

#import <React/RCTEventEmitter.h>
#import "TurboUniwind/TurboUniwind.h"
#import <ReactCommon/RCTTurboModuleWithJSIBindings.h>

@interface UniwindModule: RCTEventEmitter<NativeTurboUniwindSpec>
@end

@interface UniwindModule()<RCTTurboModuleWithJSIBindings>
@end