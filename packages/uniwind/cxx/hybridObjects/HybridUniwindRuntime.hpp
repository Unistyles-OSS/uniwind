#pragma once

#include "HybridUniwindRuntimeSpec.hpp"

namespace margelo::nitro::uniwind {

struct HybridUniwindRuntime: public HybridUniwindRuntimeSpec {
    HybridUniwindRuntime(): HybridObject(TAG) {}
    
    bool getRtl() override;
    ColorScheme getColorScheme() override;
    double getFontScale() override;
    Insets getInsets() override;
    Orientation getOrientation() override;
    double getPixelRatio() override;
    Dimensions getScreen() override;
};

}
