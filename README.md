wmf_ab
======

**wmf_ab** is a javascript library for A/B-testing 

wmf_ab currently contain these tests:
* comparing donation rates of a set of banners (rate_comparison)


### Usage ###

```javascript
var wmf_ab = require("wmf_ab");
// collect impression and donation counts
var rate_data= {
    'A' : {'num_donations': 500, 'num_impressions': 1000},
    'B' : {'num_donations': 488, 'num_impressions': 1000},
    'C' : {'num_donations': 480, 'num_impressions': 1000}
}
wmf_ab.rate_comparison(rate_data)

```


### Building from source ###

To download the package and install the development dependencies run ```npm install git://github.com/ewulczyn/wmf_ab.git```

### License ###

wmf_ab is distributed under the [MIT License](http://www.opensource.org/licenses/MIT).
