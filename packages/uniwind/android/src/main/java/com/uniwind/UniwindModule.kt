package com.uniwind

import com.facebook.fbreact.specs.NativeTurboUniwindSpec
import com.facebook.jni.HybridData
import com.facebook.proguard.annotations.DoNotStrip
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.RuntimeExecutor
import com.facebook.react.turbomodule.core.interfaces.BindingsInstallerHolder
import com.facebook.react.turbomodule.core.interfaces.TurboModuleWithJSIBindings
import com.margelo.nitro.uniwind.uniwindOnLoad.Companion.initializeNative

@Suppress("KotlinJniMissingFunction")
class UniwindModule(reactContext: ReactApplicationContext): NativeTurboUniwindSpec(reactContext), TurboModuleWithJSIBindings {
    @DoNotStrip
    private var mHybridData: HybridData?

    companion object {
        const val NAME = NativeTurboUniwindSpec.NAME

        init {
            initializeNative()
        }
    }

    override fun invalidate() {
        invalidateNative()
    }

    init {
        mHybridData = initializeHybridData(reactContext)
    }

    private fun initializeHybridData(reactContext: ReactApplicationContext): HybridData {
        val runtimeExecutor = reactContext.catalystInstance?.runtimeExecutor
            ?: throw IllegalStateException("Uniwind: React Native runtime executor is not available. Please follow installation guides.")

        return initHybrid(runtimeExecutor)
    }

    @DoNotStrip
    external override fun getBindingsInstaller(): BindingsInstallerHolder

    @DoNotStrip
    private external fun initHybrid(
        runtimeExecutor: RuntimeExecutor
    ): HybridData

    @DoNotStrip
    private external fun invalidateNative()
}