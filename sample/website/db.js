/*
 * File         :   db.js
 * Description  :   Mock database.
 * ------------------------------------------------------------------------------------------------ */
module.exports = function () {
    "use strict";

    return {
        users : [
            {
                "id" : 1,
                "email" : "admin@example.com",
                "firstName" : "I AM",
                "surname" : "ADMIN",
                "registered": "2014-05-14T11:50:48 -01:00",
                "isActive": true,
                "gender": "unknown",
                "password" : "letmein"
            },
            {
                "id": "54a503095db1ba83ec7fa0d5",
                "firstName": "Gillespie",
                "surname": "Peters",
                "email": "gillespiepeters@example.com",
                "registered": "2014-05-14T11:50:48 -01:00",
                "isActive": true,
                "gender": "male",
                "password": "password"
            },
            {
                "id": "54a5030944bbb324a772adc5",
                "firstName": "Sharron",
                "surname": "Carson",
                "email": "sharroncarson@example.com",
                "registered": "2014-07-08T16:55:40 -01:00",
                "isActive": false,
                "gender": "female",
                "password": "god"
            },
            {
                "id": "54a503093b7d795bd293dcfb",
                "firstName": "Wade",
                "surname": "Serrano",
                "email": "wadeserrano@example.com",
                "registered": "2014-04-25T20:32:59 -01:00",
                "isActive": true,
                "gender": "male",
                "password": "secret"
            },
            {
                "id": "54a50309af3f9a8acb472c34",
                "firstName": "Angelica",
                "surname": "Valdez",
                "email": "angelicavaldez@example.com",
                "registered": "2014-02-11T08:30:15 -00:00",
                "isActive": false,
                "gender": "female",
                "password": "password"
            },
            {
                "id": "54a50309e94fcb34a57a192d",
                "firstName": "Hurst",
                "surname": "Ramos",
                "email": "hurstramos@example.com",
                "registered": "2014-11-14T09:14:04 -00:00",
                "isActive": false,
                "gender": "male",
                "password": "secret"
            },
            {
                "id": "54a503091c96dc22b2f859a1",
                "firstName": "Campbell",
                "surname": "Hobbs",
                "email": "campbellhobbs@example.com",
                "registered": "2014-01-01T09:09:15 -00:00",
                "isActive": false,
                "gender": "male",
                "password": "secret"
            },
            {
                "id": "54a5030949441ed73790d7b7",
                "firstName": "Jenny",
                "surname": "Keith",
                "email": "jennykeith@example.com",
                "registered": "2014-04-11T11:30:43 -01:00",
                "isActive": false,
                "gender": "female",
                "password": "secret"
            },
            {
                "id": "54a5030984f3e0d0804b789e",
                "firstName": "Walter",
                "surname": "Cooke",
                "email": "waltercooke@example.com",
                "registered": "2014-04-01T14:02:45 -01:00",
                "isActive": true,
                "gender": "male",
                "password": "god"
            },
            {
                "id": "54a50309b1c1980acd2d889c",
                "firstName": "Fisher",
                "surname": "Arnold",
                "email": "fisherarnold@example.com",
                "registered": "2014-03-08T00:16:08 -00:00",
                "isActive": true,
                "gender": "male",
                "password": "password"
            },
            {
                "id": "54a50309683e8470a346af3b",
                "firstName": "Rosalyn",
                "surname": "Hampton",
                "email": "rosalynhampton@example.com",
                "registered": "2014-04-17T17:11:30 -01:00",
                "isActive": false,
                "gender": "female",
                "password": "test"
            },
            {
                "id": "54a5030982b459fbe5809075",
                "firstName": "Mcgowan",
                "surname": "Nguyen",
                "email": "mcgowannguyen@example.com",
                "registered": "2014-04-01T11:45:53 -01:00",
                "isActive": true,
                "gender": "male",
                "password": "god"
            },
            {
                "id": "54a50309e2ea447c23e0c1b9",
                "firstName": "Pugh",
                "surname": "Armstrong",
                "email": "pugharmstrong@example.com",
                "registered": "2014-01-12T14:25:37 -00:00",
                "isActive": false,
                "gender": "male",
                "password": "password"
            },
            {
                "id": "54a50309fb67c4006a476cba",
                "firstName": "Carter",
                "surname": "Schneider",
                "email": "carterschneider@example.com",
                "registered": "2014-02-19T12:16:30 -00:00",
                "isActive": false,
                "gender": "male",
                "password": "password"
            },
            {
                "id": "54a50309793551c8e9ea0b7b",
                "firstName": "Dana",
                "surname": "Dunlap",
                "email": "danadunlap@example.com",
                "registered": "2014-12-26T04:28:33 -00:00",
                "isActive": true,
                "gender": "female",
                "password": "password"
            },
            {
                "id": "54a503094fefaf39095cee23",
                "firstName": "Parks",
                "surname": "Phelps",
                "email": "parksphelps@example.com",
                "registered": "2014-07-06T17:52:30 -01:00",
                "isActive": false,
                "gender": "male",
                "password": "secret"
            },
            {
                "id": "54a5030987c126c653b55e39",
                "firstName": "Aimee",
                "surname": "Warren",
                "email": "aimeewarren@example.com",
                "registered": "2014-06-10T07:05:35 -01:00",
                "isActive": false,
                "gender": "female",
                "password": "password"
            },
            {
                "id": "54a50309961653b4c6ec7049",
                "firstName": "Lillie",
                "surname": "Ewing",
                "email": "lillieewing@example.com",
                "registered": "2014-07-01T07:02:48 -01:00",
                "isActive": false,
                "gender": "female",
                "password": "test"
            },
            {
                "id": "54a5030913c8a75d695c30e4",
                "firstName": "Patricia",
                "surname": "Larsen",
                "email": "patricialarsen@example.com",
                "registered": "2014-12-31T15:26:12 -00:00",
                "isActive": true,
                "gender": "female",
                "password": "god"
            },
            {
                "id": "54a50309b463f3a3c67568d9",
                "firstName": "Deidre",
                "surname": "Douglas",
                "email": "deidredouglas@example.com",
                "registered": "2014-12-08T05:06:01 -00:00",
                "isActive": true,
                "gender": "female",
                "password": "test"
            },
            {
                "id": "54a50309e64fb2a8aef57b64",
                "firstName": "Janell",
                "surname": "Small",
                "email": "janellsmall@example.com",
                "registered": "2014-08-19T01:52:26 -01:00",
                "isActive": false,
                "gender": "female",
                "password": "password"
            },
            {
                "id": "54a503090be55ec1cbf7c095",
                "firstName": "Mayra",
                "surname": "Mcintosh",
                "email": "mayramcintosh@example.com",
                "registered": "2014-02-25T07:53:32 -00:00",
                "isActive": false,
                "gender": "female",
                "password": "test"
            },
            {
                "id": "54a503097606e04aeeac3f36",
                "firstName": "Dillard",
                "surname": "Kirk",
                "email": "dillardkirk@example.com",
                "registered": "2014-07-05T03:02:36 -01:00",
                "isActive": false,
                "gender": "male",
                "password": "password"
            },
            {
                "id": "54a5030993fd7a281392af30",
                "firstName": "Essie",
                "surname": "Vazquez",
                "email": "essievazquez@example.com",
                "registered": "2014-06-18T00:13:48 -01:00",
                "isActive": false,
                "gender": "female",
                "password": "god"
            },
            {
                "id": "54a50309b76d8ab8525835d6",
                "firstName": "Dudley",
                "surname": "Stephens",
                "email": "dudleystephens@example.com",
                "registered": "2014-11-25T05:45:29 -00:00",
                "isActive": false,
                "gender": "male",
                "password": "test"
            },
            {
                "id": "54a50309dc5c5079a5893ce4",
                "firstName": "Wiley",
                "surname": "Mcpherson",
                "email": "wileymcpherson@example.com",
                "registered": "2014-12-16T08:00:01 -00:00",
                "isActive": false,
                "gender": "male",
                "password": "god"
            },
            {
                "id": "54a5030957808a355902aa9b",
                "firstName": "Deborah",
                "surname": "Reeves",
                "email": "deborahreeves@example.com",
                "registered": "2014-02-25T10:19:50 -00:00",
                "isActive": false,
                "gender": "female",
                "password": "test"
            },
            {
                "id": "54a50309e71b4ebb9ecaad17",
                "firstName": "Wolfe",
                "surname": "Lane",
                "email": "wolfelane@example.com",
                "registered": "2014-05-08T20:09:58 -01:00",
                "isActive": true,
                "gender": "male",
                "password": "password"
            },
            {
                "id": "54a50309ef66d6ef5ee1bff1",
                "firstName": "Taylor",
                "surname": "Miller",
                "email": "taylormiller@example.com",
                "registered": "2014-06-25T17:07:43 -01:00",
                "isActive": false,
                "gender": "female",
                "password": "password"
            },
            {
                "id": "54a50309aa470c632b85cb7b",
                "firstName": "Summer",
                "surname": "Jacobson",
                "email": "summerjacobson@example.com",
                "registered": "2014-11-05T11:03:14 -00:00",
                "isActive": true,
                "gender": "female",
                "password": "secret"
            },
            {
                "id": "54a50309e006b6de32b203b8",
                "firstName": "William",
                "surname": "Pollard",
                "email": "williampollard@example.com",
                "registered": "2014-08-10T13:43:17 -01:00",
                "isActive": false,
                "gender": "male",
                "password": "test"
            },
            {
                "id": "54a50309eaa1adae2be6c2f9",
                "firstName": "Montoya",
                "surname": "Sims",
                "email": "montoyasims@example.com",
                "registered": "2014-10-11T01:08:32 -01:00",
                "isActive": true,
                "gender": "male",
                "password": "god"
            },
            {
                "id": "54a50309e9ee0d241a0b1d03",
                "firstName": "Neal",
                "surname": "Decker",
                "email": "nealdecker@example.com",
                "registered": "2014-04-15T13:14:34 -01:00",
                "isActive": false,
                "gender": "male",
                "password": "secret"
            },
            {
                "id": "54a5030973ed9ce8d662c487",
                "firstName": "Henson",
                "surname": "Oneal",
                "email": "hensononeal@example.com",
                "registered": "2014-08-02T13:29:56 -01:00",
                "isActive": false,
                "gender": "male",
                "password": "password"
            },
            {
                "id": "54a50309a757ee1d8124a8c1",
                "firstName": "Armstrong",
                "surname": "Sullivan",
                "email": "armstrongsullivan@example.com",
                "registered": "2014-06-10T18:28:06 -01:00",
                "isActive": true,
                "gender": "male",
                "password": "secret"
            },
            {
                "id": "54a503095294053d2cede46c",
                "firstName": "Beatrice",
                "surname": "Hahn",
                "email": "beatricehahn@example.com",
                "registered": "2014-04-18T11:11:40 -01:00",
                "isActive": true,
                "gender": "female",
                "password": "god"
            },
            {
                "id": "54a50309b639a0893fae4d88",
                "firstName": "Juliet",
                "surname": "Hinton",
                "email": "juliethinton@example.com",
                "registered": "2014-12-26T06:49:05 -00:00",
                "isActive": true,
                "gender": "female",
                "password": "god"
            },
            {
                "id": "54a50309de86696b721078fd",
                "firstName": "Spencer",
                "surname": "Osborn",
                "email": "spencerosborn@example.com",
                "registered": "2014-02-28T05:55:02 -00:00",
                "isActive": false,
                "gender": "male",
                "password": "password"
            },
            {
                "id": "54a503092d9597f37c05621a",
                "firstName": "Anita",
                "surname": "Charles",
                "email": "anitacharles@example.com",
                "registered": "2014-05-25T18:16:03 -01:00",
                "isActive": false,
                "gender": "female",
                "password": "password"
            },
            {
                "id": "54a50309558d2c98d5f37904",
                "firstName": "Rebekah",
                "surname": "Richardson",
                "email": "rebekahrichardson@example.com",
                "registered": "2014-04-28T09:46:02 -01:00",
                "isActive": false,
                "gender": "female",
                "password": "password"
            },
            {
                "id": "54a5030988a21dcc9f207d51",
                "firstName": "Coleen",
                "surname": "Morin",
                "email": "coleenmorin@example.com",
                "registered": "2014-08-05T20:08:17 -01:00",
                "isActive": false,
                "gender": "female",
                "password": "secret"
            },
            {
                "id": "54a50309dcbea9cba448fc76",
                "firstName": "Imelda",
                "surname": "Tanner",
                "email": "imeldatanner@example.com",
                "registered": "2014-01-04T23:28:09 -00:00",
                "isActive": true,
                "gender": "female",
                "password": "secret"
            },
            {
                "id": "54a503095c53ceda9d4ab49b",
                "firstName": "Cora",
                "surname": "Merrill",
                "email": "coramerrill@example.com",
                "registered": "2014-12-12T08:30:50 -00:00",
                "isActive": true,
                "gender": "female",
                "password": "secret"
            },
            {
                "id": "54a503090abba172b3f8f7f5",
                "firstName": "Pauline",
                "surname": "Stone",
                "email": "paulinestone@example.com",
                "registered": "2014-10-27T13:34:27 -00:00",
                "isActive": false,
                "gender": "female",
                "password": "god"
            },
            {
                "id": "54a50309647ad6b259eff524",
                "firstName": "Liza",
                "surname": "Kent",
                "email": "lizakent@example.com",
                "registered": "2014-12-28T22:39:53 -00:00",
                "isActive": true,
                "gender": "female",
                "password": "password"
            },
            {
                "id": "54a50309f5feccbe3b0d5eff",
                "firstName": "Ines",
                "surname": "Benton",
                "email": "inesbenton@example.com",
                "registered": "2014-06-16T06:40:50 -01:00",
                "isActive": false,
                "gender": "female",
                "password": "god"
            },
            {
                "id": "54a50309b7f36917155a7894",
                "firstName": "Patterson",
                "surname": "Rosa",
                "email": "pattersonrosa@example.com",
                "registered": "2014-12-06T22:33:43 -00:00",
                "isActive": false,
                "gender": "male",
                "password": "secret"
            },
            {
                "id": "54a50309b1003b9c029f1218",
                "firstName": "Odom",
                "surname": "Lewis",
                "email": "odomlewis@example.com",
                "registered": "2014-02-14T02:36:13 -00:00",
                "isActive": false,
                "gender": "male",
                "password": "password"
            },
            {
                "id": "54a5030918cc64ce507de4a6",
                "firstName": "Claudia",
                "surname": "Todd",
                "email": "claudiatodd@example.com",
                "registered": "2014-07-29T16:59:43 -01:00",
                "isActive": true,
                "gender": "female",
                "password": "secret"
            },
            {
                "id": "54a50309de5e1fc5afe6868d",
                "firstName": "Cherie",
                "surname": "Valenzuela",
                "email": "cherievalenzuela@example.com",
                "registered": "2014-07-27T06:42:21 -01:00",
                "isActive": false,
                "gender": "female",
                "password": "password"
            },
            {
                "id": "54a503098d12694ce8f573d0",
                "firstName": "Thomas",
                "surname": "Hatfield",
                "email": "thomashatfield@example.com",
                "registered": "2014-06-06T20:07:21 -01:00",
                "isActive": false,
                "gender": "male",
                "password": "password"
            },
            {
                "id": "54a50309672fc31e4582b478",
                "firstName": "Sharlene",
                "surname": "Hill",
                "email": "sharlenehill@example.com",
                "registered": "2014-01-16T23:30:32 -00:00",
                "isActive": false,
                "gender": "female",
                "password": "test"
            },
            {
                "id": "54a5030931e528a839a39097",
                "firstName": "Aileen",
                "surname": "Mcbride",
                "email": "aileenmcbride@example.com",
                "registered": "2014-02-15T14:37:34 -00:00",
                "isActive": false,
                "gender": "female",
                "password": "god"
            },
            {
                "id": "54a5030955192c9967f01c44",
                "firstName": "Davis",
                "surname": "Mcconnell",
                "email": "davismcconnell@example.com",
                "registered": "2014-02-08T15:11:49 -00:00",
                "isActive": false,
                "gender": "male",
                "password": "test"
            },
            {
                "id": "54a503090754ee4c3393b419",
                "firstName": "Simmons",
                "surname": "Vargas",
                "email": "simmonsvargas@example.com",
                "registered": "2014-10-12T01:48:30 -01:00",
                "isActive": false,
                "gender": "male",
                "password": "secret"
            },
            {
                "id": "54a50309ca2dd9fe87e6d68e",
                "firstName": "Adkins",
                "surname": "Castro",
                "email": "adkinscastro@example.com",
                "registered": "2014-04-19T14:12:21 -01:00",
                "isActive": false,
                "gender": "male",
                "password": "god"
            },
            {
                "id": "54a50309176523a0fbc1b287",
                "firstName": "Douglas",
                "surname": "Rhodes",
                "email": "douglasrhodes@example.com",
                "registered": "2014-02-23T21:55:35 -00:00",
                "isActive": true,
                "gender": "male",
                "password": "password"
            },
            {
                "id": "54a50309c8ab9ee45f48969b",
                "firstName": "Daisy",
                "surname": "Pena",
                "email": "daisypena@example.com",
                "registered": "2014-06-17T05:15:24 -01:00",
                "isActive": false,
                "gender": "female",
                "password": "password"
            }
        ]
    };
};
