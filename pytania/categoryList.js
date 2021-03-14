const zrodla = require("./zrodla");
const analiza = require("./analiza");
const miedzywspol = require("./miedzywspol");
const matprawo = require("./matprawo");
const dodatkowa = require("./dodatkowa");





module.exports= {

    categories:[

        {  
            "id":1,
            "name":"ŹRÓDŁA PRAWA I WYKŁADNIA PRAWA",
            "quoestions":zrodla.questions
        },
        {  
            "id":2,
            "name":"ANALIZA PODATKOWA",
            "quoestions":analiza.questions
        },
        {  
            "id":3,
            "name":"PODSTAWY MIĘDZYNARODOWEGO ORAZ WSPÓLNOTOWEGO PRAWA PODATKOWEGO",
            "quoestions":miedzywspol.questions
        },
        {  
            "id":4,
            "name":"MATERIALNE PRAWO PODATKOWE ZAGADNIENIA WSPÓLNE",
            "quoestions":matprawo.questions
        },
        {  
            "id":5,
            "name":"DODATKOWA KATEGORIA",
            "quoestions":dodatkowa.questions
        }

    ]
  
};