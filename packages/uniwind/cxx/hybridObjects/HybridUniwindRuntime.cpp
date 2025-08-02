#include "HybridUniwindRuntime.hpp"

using namespace margelo::nitro::uniwind;

// TODO: call native platform instead of mocks

bool HybridUniwindRuntime::getRtl() {
    return false;
};

ColorScheme HybridUniwindRuntime::getColorScheme() {
    return ColorScheme::LIGHT;
};

double HybridUniwindRuntime::getFontScale() {
    return 1.0f;
};

Insets HybridUniwindRuntime::getInsets() {
    return Insets(0.0, 0.0, 0.0, 0.0);
};

Orientation HybridUniwindRuntime::getOrientation() {
    return Orientation::PORTRAIT;
};

double HybridUniwindRuntime::getPixelRatio() {
    return 1.0;
};

Dimensions HybridUniwindRuntime::getScreen() {
    return Dimensions(390.0, 844.0);
};
