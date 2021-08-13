# lovelace-pan-tilt-card

A simple card for controlling pan-tilt mechanisms via a pair of input_number helpers or number entities when using something like [ESPHome](https://esphome.io/).

Example ESPHome configuration for a pair of servos using number entities:
```yaml
output:
  - platform: ledc
    pin: GPIO27
    id: servo_pan_pin
    frequency: 50 Hz
  - platform: ledc
    pin: GPIO12
    id: servo_tilt_pin
    frequency: 50 Hz

servo:
  - id: servo_pan
    output: servo_pan_pin
    min_level: 4%
    idle_level: 7.5%
    max_level: 11%
    auto_detach_time: 0.5s
    transition_length: 0.5s
  - id: servo_tilt
    output: servo_tilt_pin
    min_level: 5%
    idle_level: 7.5%
    max_level: 8.5%
    auto_detach_time: 0.5s
    transition_length: 0.5s

number:
  - platform: template
    name: Pan
    min_value: -100
    max_value: 100
    step: 5
    initial_value: 0
    optimistic: true
    on_value:
      then:
        - servo.write:
            id: servo_pan
            level: !lambda 'return x / 100.0;'
  - platform: template
    name: Tilt
    min_value: -100
    max_value: 100
    step: 5
    initial_value: 0
    optimistic: true
    on_value:
      then:
        - servo.write:
            id: servo_tilt
            level: !lambda 'return x / 100.0;'
```

Example configuration in Lovelace:
```yaml
type: custom:pan-tilt-card
flip_x: true
entity_x: number.pan
entity_y: number.tilt
```

[![hacs_badge](https://img.shields.io/badge/HACS-Custom-orange.svg?style=for-the-badge)](https://github.com/custom-components/hacs)
[![GitHub release (latest by date)](https://img.shields.io/github/v/release/Freakus/lovelace-pan-tilt-card?label=Latest%20release&style=for-the-badge)](https://github.com/Freakus/lovelace-pan-tilt-card/releases)
[![GitHub](https://img.shields.io/github/license/Freakus/lovelace-pan-tilt-card?style=for-the-badge)](LICENSE.md)
