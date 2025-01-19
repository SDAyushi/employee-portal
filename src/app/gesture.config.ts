import { Injectable } from '@angular/core';
import { HammerGestureConfig } from '@angular/platform-browser';

@Injectable()
export class CustomHammerConfig extends HammerGestureConfig {
  override overrides = {
    swipe: { direction: 31 }, // Enable all swipe directions (left, right, up, down)
    tap: { taps: 1 },         // Configure tap gestures if needed
    pinch: { enable: true },  // Enable pinch gestures if required
  };
}
