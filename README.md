# Ionic Time Setter
A time selection picker widget for Ionic Framework (v1).

<img src="/screenshots/screenshot.png?raw=true" width="320">

## How to use

1) Install it:

```shell
$ bower install ionic-time-setter --save
```

2) Add the js to your html:

```html
<script src="lib/ionic-time-setter/dist/ionic-time-setter.min.js"></script>
```

3) Import in your controller:

```JavaScript
angular.module('app', ['ionic', 'ionic-time-setter'])
    .controller(function( TimeSetter ) {
        TimeSetter.show({
          onSet: function(hour, minute) {
            // Do something with the values.
            // Hour is 24-hour time, 0-23.
          }
        });
    });
```

## Available options:

| Key  | Type | Default | Description |
| ---- | ---- | ------ | ---- |
|startHour | int | 0 | The default starting hour, defaults to midnight, must be in 24-hour time (0-23) |
|startMinute | int | 0 | The default starting minutes, defaults to 0 |
|cancelText | string | "Cancel" | Cancel button text |
|cancelClass | string | "button-outline button-dark" | Class(es) to apply to the cancel button |
|setText | string | "Set Time" | Set button text |
|setClass | string | "button-outline button-dark" | Class(es) to apply to the set button |
|onSet | function | none | Function to call when the "Set" button is pressed.  It takes two arguments:  hour and minutes |
