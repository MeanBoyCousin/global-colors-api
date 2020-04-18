# Global Colors API

## API Reference
All endpoints are located at `http://localhost:3000/api/v1/`

## API Endpoints

### All Endpoint
```http
GET /v1/all
```
#### Query String Parameters
|Query String Parameter|Example|Description|Type|Accepts|
|--- |--- |--- |--- |--- |
|colors|/v1/all?colors=green,blue|only return countries that use a certain color|string (comma separated if a list)|blue, brown, cyan, green, grey, orange, pink, purple, red, white, yellow|
|continents (CC)|/v1/all?continents=SA,NA|only return countries within the specified continents|string (comma separated if a list)|AF, AN, AS, EU, NA, OC, SA|
|countries (ISO Alpha-3)|/v1/all?countries=USA,GBR,CHN|only return specified countries|string (comma separated if a list)|any ISO Alpha-3 country code *|
|nbw|/v1/all?nbw|removes all black and white colors from the returned data|||
|prettify|/v1/all?prettify|returns the JSON in pretty print|||
|set|/v1/all?set=secondary|only return primary or secondary colors|string|primary, secondary|
|types|/v1/all?set=hex,css|only return colors in specified formats|string (comma separated if a list)|hex, rgb, hsl, css|
#### Example Request
```http
GET /v1/all?colors=yellow&continents=OC&nbw&types=hex,css&set=secondary
```
#### Example Response
```js
{
    "Oceania": {
        "continentName": "Oceania",
        "continentCode": "OC",
        "countries": {
            "Cook Islands": {
                "countryName": "Cook Islands",
                "countryCode": "COK",
                "secondary": {
                    "hex": [ "#005a00", "#ffd700" ],
                    "css": [ "darkgreen", "gold" ],
                    "notes": "Colors from the previous flag."
                }
            },
            "Tuvalu": {
                "countryName": "Tuvalu",
                "countryCode": "TUV",
                "secondary": {
                    "hex": [ "#00247d", "#fee014" ],
                    "css": [ "midnightblue", "gold" ],
                    "notes": "Colors used in the flag of the Govenor-General of Tuvalu."
                }
            }
        }
    }
}
```
#

### Secondary Endpoint
```http
GET /v1/secondary
```
#### Query String Parameters
|Query String Parameter|Example|Description|Type|Accepts|
|--- |--- |--- |--- |--- |
|colors|/v1/all?colors=green,blue|only return countries that use a certain color|string (comma separated if a list)|blue, brown, cyan, green, grey, orange, pink, purple, red, white, yellow|
|continents (CC)|/v1/all?continents=SA,NA|only return countries within the specified continents|string (comma separated if a list)|AF, AN, AS, EU, NA, OC, SA|
|countries (ISO Alpha-3)|/v1/all?countries=USA,GBR,CHN|only return specified countries|string (comma separated if a list)|any ISO Alpha-3 country code *|
|nbw|/v1/all?nbw|removes all black and white colors from the returned data|||
|prettify|/v1/all?prettify|returns the JSON in pretty print|||
|types|/v1/all?set=hex,css|only return colors in specified formats|string (comma separated if a list)|hex, rgb, hsl, css|
#### Example Request
```http
GET /v1/secondary?colors=purple&countries=THA&nbw&types=rgb
```
#### Example Response
```js
{
    "Asia": {
        "continentName": "Asia",
        "continentCode": "AS",
        "countries": {
            "Thailand": {
                "countryName": "Thailand",
                "countryCode": "THA",
                "secondary": {
                    "rgb": [ "rgb(42,127,255)", "rgb(188,130,207)", "rgb(255,224,0)" ],
                    "notes": "Colors used in the royal flags of Thailand."
                }
            }
        }
    }
}
```
#

### Continents Endpoint
```http
GET /v1/:continent-code
```
#### Path Parameters
|Path Parameter|Example|Description|Type|Accepts|
|--- |--- |--- |--- |--- |
|continent-code|/v1/EU|only return countries within the specified continent|string (CC)|AF, AN, AS, EU, NA, OC, SA|
#### Query String Parameters
|Query String Parameter|Example|Description|Type|Accepts|
|--- |--- |--- |--- |--- |
|colors|/v1/all?colors=green,blue|only return countries that use a certain color|string (comma separated if a list)|blue, brown, cyan, green, grey, orange, pink, purple, red, white, yellow|
|countries (ISO Alpha-3)|/v1/all?countries=BLR,MDA|only return specified countries that are within the choosen continent|string (comma separated if a list)|any ISO Alpha-3 country code *|
|nbw|/v1/all?nbw|removes all black and white colors from the returned data|||
|prettify|/v1/all?prettify|returns the JSON in pretty print|||
|set|/v1/all?set=secondary|only return primary or secondary colors|string|primary, secondary|
|types|/v1/all?set=hex,css|only return colors in specified formats|string (comma separated if a list)|hex, rgb, hsl, css|
#### Example Request
```http
GET /v1/EU?countries=LTU,NLD&types=hsl,css&set=primary
```
#### Example Response
```js
{
    "continentName": "Europe",
    "continentCode": "EU",
    "countries": {
        "Lithuania": {
        "countryName": "Lithuania",
        "countryCode": "LTU",
            "primary": {
                "hsl": [ "hsl(44,98%,52%)", "hsl(157,100%,21%)", "hsl(358,69%,45%)" ],
                "css": [ "orange", "darkslategray", "firebrick" ]
            }
        },
        "Netherlands": {
        "countryName": "Netherlands",
        "countryCode": "NLD",
            "primary": {
                "hsl": [ "hsl(19,100%,50%)" ],
                "css": [ "orangered" ]
            }
        }
    }
}
```
#

### Countries Endpoint
```http
GET /v1/:country-code
```
#### Path Parameters
|Path Parameter|Example|Description|Type|Accepts|
|--- |--- |--- |--- |--- |
|country-code|/v1/USA|only return the specified country|string (ISO Alpha-3)|any ISO Alpha-3 country code *|
#### Query String Parameters
|Query String Parameter|Example|Description|Type|Accepts|
|--- |--- |--- |--- |--- |
|nbw|/v1/all?nbw|removes all black and white colors from the returned data|||
|prettify|/v1/all?prettify|returns the JSON in pretty print|||
|set|/v1/all?set=secondary|only return primary or secondary colors|string|primary, secondary|
|types|/v1/all?set=hex,css|only return colors in specified formats|string (comma separated if a list)|hex, rgb, hsl, css|
#### Example Request
```http
GET /v1/USA?nbw&types=hex
```
#### Example Response
```js
{
    "countryName": "United States of America",
    "countryCode": "USA",
        "primary": {
            "hex": [ "#b41d31", "#39386e" ]
        },
        "secondary": ""
}
```
#

#### References
\* Some additional ISO Alpha-3 style codes have been added to this API to represent countries that do not have official codes. These include the following.

|Country Name|Country Code|
|--- |--- |
|England|ENG|
|Northern Ireland|NIR|
|Scotland|SCO|
|Tibet|TIB|
|Wales|WAL|
|Australian Antarctic Claim|ATAAUS|
|Argentinian Antarctic Claim|ATAARG|
|Chilean Antarctic Claim|ATACHL|
|French Antarctic Claim|ATAFRA|
|New Zealands Antarctic Claim|ATANZL|
|Norwegian Antarctic Claim|ATANOR|
|British Antarctic Claim|ATAGBR|

If you feel there are any others missing or you would like something added, [please raise an issue.](https://github.com/MeanBoyCousin/global-colors-api/issues).

## Authors
Tim Dunphy

## License
This project is licensed under the MIT License - see the [LICENSE.md](./LICENSE) file for details.
