/* V233 — Galácticos de Pozos · 09 feb 2025
   Tarjeta reconstruida desde cero con la fotografía EMBEBIDA en el propio JS.
   No depende de rutas externas, raw.githubusercontent, CSS background-image ni caché de assets. */
(function(){
'use strict';

const PHOTO='data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAoHBwgHBgoICAgLCgoLDhgQDg0NDh0VFhEYIx8lJCIfIiEmKzcvJik0KSEiMEExNDk7Pj4+JS5ESUM8SDc9Pjv/2wBDAQoLCw4NDhwQEBw7KCIoOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozv/wgARCAFHArwDASIAAhEBAxEB/8QAGwAAAgMBAQEAAAAAAAAAAAAAAQIAAwQFBgf/xAAZAQEBAQEBAQAAAAAAAAAAAAAAAQIDBAX/2gAMAwEAAhADEAAAAenTevr81LVDlu7Qlus1hp1wpMAGAIYCGAhgIYCGAhgDCCGEkIIYAwgJgIYoMIISCGAhgIYCEghgIYCEixoCGAhhIZEhgIYAwwsaKpMATAGSJDAQwEaQsaCkwxQzcyTWcaWGazAwoQwEMBDAQwEMAZCQwWE0IYCGAhIpMAYQGEEMJIYBhBDAQwEJpSZAhgIYCEElRzbZVdQJiAyEhgIZKCYCEixpAhgDISGKIYCGEkkSQmKE7iuGzUDTWQGigNEWNBY0FjQWEixoohiCGAhlCGAJgISKSVEMBCQQwBMgQkEMBDAQxJDJRCRUtUrz35Oe9li2byIZYDDAhgCYohgCZAhgIYCGAMIISLGkLGgA0XHGmorhpUhliw4jZPDdPG/TTkabNjec68uyZtesqTNQQwEJFjQWNEWMASoS3wmxSTSkyURoCNBSSLGEAmAhIsaCkwEJFjACWLKSYghgISKTFEMgQkEMBDAQwBMBDIBkJJCSQgMMsMtDBpVDCyryHsPMTOHqc7qeT3ZehnrNjUCy70flu8ltnFy9eXfnmtXTHbnlsFe4nC61zfGqsyrzJw6X6cDYvZvx3ejneORTi9xORr1ei0m8Q1vKZDYIYCKYaSVIYCBJbEnl5fSX+L7eddpGGsNAhYYbBDIEaKA0FJiCFVMqugEyhDIEhBDAGQkMBDDj6/HW+br17/OdlLM3J6ex5d2Da7Vm9Hx75VuaqlVspfl0Lm5XS4la9XK06zVpoum9m3PXl1sfLX0cBZnTk1ZWpl7wt5ktGtLMZy9nk7N9vRgcDt5+/Xlq82+lt5PX685CPRiuyqyXDV5y9v13At4mL6DXifNt85uzZrdTi9jHY9fn6uvl8aCc9/S9fB0OvARprAhiiGAhrirlZ+fx32en5/Ti+glN/p5zPoxmiwwEMBCoZkz5vR5FXOxefX3lzvhej5/J6QZlr07Po/D9eXp287Zq2cfo8g6GLPVHoc1eeXGueyS66/IUb8/RXsU5rK5WHXmw14u7jEz9zN1w1HZy8+mbna+f38x3228u78+rLvl1ejwl8/o2b+V1j0lvPyd+HWOQRwcyYePo9TzuVqrvYl4ub18mXL157buXbHTXntpuqqHLfr04fO1PolnnvQa5FT5PWfTp5gzXoebjxYZRSmHSs5unF9Lt8+nSetyTJ1z2iGsWhebz30PNdnyWGuctY0Lmm57Z1O9ef5WqvcyWev8AOYvP63Iaz1tnldGnpeTlrXD1+V1Za+Xa0lW5OvWjmYtGrNOHBmdNqe/Lnfkenl4Cd/y+8djv+W6PTPT8x0cO8Y4mXzd+nqx38e3Eb03mu/BbUvNO7gty6XWZejZ0+e+Yw0i/eL6RcrZL7IxArrOixHihs2iWzVRdT5LqUnsfE93OurzrqUMraU1MlmLD2uXMrtz6+eqtjLrGyvC2t9bNgumwUXF2cbaDl178msJDTrPqtOXXjXnutyu70m3x3qvGxVcdulejrbJ08/1LcqYR6LxWLVs57duXT5ckL1OV3V53RwaMdO/lrx89roz7evPs+Y7PATo68Oz1cZg14tZ5OvFZ5OwsV4ApTcuFTF6Oubouoqzvd2eAs1kvqq6cTu5+utJFUYw7rUytYtiHOutdy3l14hVc7iNHPr28NmTMfn01uXS2Tb1vJwdzmZtJO/LNvs1Vjj02JVsolqw7sdZ9PNsssyaUsFsMvso8+brzXoseD0b7XhvT8rpz52nHZ6Zqv59y9TCo3nnNTMXRF0WXV9rjcL0Oj5tr135tC6z1MltPRKPVcbneXux256JkmTpx15QmsiypZN1Grny2VOKnRwas7zo1Vxa/U5U1ZRatnSy318+nNsrPXloUipdTpzcRU7wSm7NRkOdRGQ6Onm6OfT0eC/fznm29CMcuW/RlcvkeqkvLt3xctW+HFu6ZOHO5K4Nfoq7POL6FdPPJ6FE4C9+HUNR8erAoLvMei873nEtof3yXZhG9sN+5S1mTN1WZL604epyOd3YxNT0kq3W823lpm+y0eC9T058nTr5NTNkt4d7KqprCMxs6/D9Jw8s+xEtYWUjPSNZ63E9Dg498DCdMXpWIMIp2so1htnPtzc7LZvC+k857bhfJkJusgWy7Jrx6z1fU+D9D5unfijwSwKBgApKiR4sVgCSSAhlSQRIJBKAYoeuSYqWcHt8nrfMnTl94DVmiW1X1b2eknmeL00avRb+buzpXLH017I3Ppy26nIOj0/M+k78N3ivS+Tl15WfnuBLtB0cVvO+k4PS4HO68U0b3lbRl1i3NbbrOnb1u5z147B7byOc4begr08/MlfXh08vQflrgmev1y8hdbN232Xne9454RNGb2JLUNGYrqS1dmL6jVxep4LZEnIwAGElANIEkCQAmNasYiRhSkmWkyXnJCDl9fLt5rHvo92utk9BZ5J4xth9HTua0Xx8/J9XldT19b6/U+X6uXluq1ybbzOhXQ7adlPIaUxdMbOJ6Hmeb1JkzesTx3Rz7bOhzexRynV8b67zG8U9Hjdue2q7pY451Nd/byaLjOHfu5eaNZ71+Hocu2LLE78+fObQ49D1/hvR8c8zPbz+t9hrybfBPB0+x817btz+qx8Z5CWL7JPQcP13KjVW/joDrjMKgeVwtNLK0URYK3pmrFWtRLbxSppFMKyxYSM5U7w8mmrN6+vqjJ4+fAe7lert6SqHhy81qsz+rpv5DdjWPPNrftijo5/ZbxR3uLscfKYBmd+pyfSeexvN0s2vneXOhLOtipr49OzVy9Wut+7kenvPzlHbwduNuLXr6Z89q6tvm6twe9xFc4N89HPOadPLKYLH7vA2xv4fpuFxet1tPDeX5/wBR5f079hUR58+Lhb6vMex8p7Dy1I08WkJBGWaNFYBgWRlkKGUIxK1vUrFyAR4KyxktRXpvryJbn5209+vYbzSc+Xb4XY5/be8cjYzu5fqvE9KssnXCP1et0xh62Xd08Tcvs+A5eiI1fP0+w5ZaXz0u0Yyle/n6g00XummMO+M3ruD28y3hdynnujFbxrOjzJRz12eRpms5NfL3azQuzHbcvRzYzVV0rGtPN3bMXpMK/BV8p6rxPpvuG5vTxnxd76fXnker8t6jLQ0f5+6y8trVxJA4pq2CqZIiWQDq1BWgjiUVlkcBcPX9OOWvo7cvMt6Wq3hemo7XXXlKn5GMejyciztdHP63R3nzM6Mys4/e5ffPR6Uy9edmfRyee9vO9Dw115tnZ4a8T6Trnh351t/ktTr056/Z5ylddNnVOe9uvk6NZ9wvnupw687ivlsayjo5ud/SznPH2+stjz/O9XnufOL6HJXOrdty7p8OW+kfzD8LszJt6tXV87p757vn+hzue+X6fl9qZ0hm8HREsEVSySVixJAtkEeCUyCmtzHTRWsiyU22qrg8ho9E/bHAs79cvIfqjLmegyDZlZ+Vxrqy1m4yt6c5x3OZqet8xj1d8eiw5KunHfzuzi8/foY6Otz9HM6HIs9PHs4eUub1MtUlyW5Z0w2Z1xpLIIbpYumDRp6XHv4vd695jyPodszVhPOgFZJGELEGYtWlWa8m5a5ub0E08ll9tVt5S30txyj1RzsiCGitFUuWxGKytFttSm1ZEgmcwMgTFgRkiFmtENQ4M1EdIFlkG2qBWNroOV12PL9fY+uSU7KcXx+lH+jz0dbm7+c61PPy+btzO9zul6HCX1Rs8s3S42nR5nWvxrgbO90bPJ9D0xXi771xpjFxZJIMgkMEgkLDpESCDOSpSEJMhDV0wsSA6RbHy6KZZLWreaKFbKSLTBDBKyorNFYsEV16EkRo1KljZZ2dUaMLaLFNkV3KyTCpa9uaaFkFiKMwdUZgUNY1jLZJrO7hJYstfz/oH3fLdzaOlgYZCyqyHaN1lK2pmrFXnLJWZWQCZeRAqDJJFooEkcBoJAJYoIsri2t1RxHUW0WWx4bUem/RUd6rkuqiOsIl1pmLsVC+FMsEFK2gVa8sgKphpW6vpRBZJUzOqy6pZYpACEosC5lqq9F2rtJBgxpQYFWIFrGk6MpXMBD2PYG6yit05VKtC5Vvao1dq0kkkeompBKep1ig21yGxVi2tgVG1kzm1ZVZosUslC3CrKXsWooySxRdWmm62tL60NRSDsy273ZTow2WBRywwrYMqQ6NMmqBJIXkWLIjSSSJJBeRXWTSlpJFSQutklVpLWSQZZLLTJbneQ1tJ3lOaTlS8mAkhGkGqkplkFkkMsiFZMmSSlaTMqaSmaSqzJEeRVElSSDJILbJRWSUiSqBIc7PJ07b+hJx6ASa8wMjIeQ//8QALhAAAgICAQMEAQMFAAMBAAAAAQIAAwQREhATIQUUIjFBICMyJDAzQlA0QGAV/9oACAEBAAEFAoE0ePGHbQht6/8AlDvTFjFbgB8h/wDKlX56sB/+X/H/AEydDurrmuu4v/B14/6bTYiH5+P+Cf4/9MjcdVC/DSoB/wAH/X+xsb/5gH/C/wBet+UlNT5VtrJlMq154ae6WDud1bxPcJB5X+4z6lZ5f+4P+F/r0ffDK+UCgSrF2Pb8MrjPqampT/hjrxP9hrdWNaDHY81s0UcEdCdA7m35Df8AY+v7JOp3q99F/wCF/rNgRj+3YvkqpPtm71iFLtmL9baBm2t3BK7LeL59+6s23lZntWbfVXKV5doK+ohRXelhjaIa0k/Dk+1NZlR8vaEZ8r9w3NZVVlCo1ZVb29Oc3+l/4BRr9O4Zm5Fj2YtNvPGydW7EWEhQLaz/AHD4CPy/9D3Vew9ZWzMAmTcUSnI3XfkcgMrSNcHg+R48Xs2Zoz6AG4BG5cdQ3sjJn3VlmS8FBunhDTW0qvRG98usi8Worcoh8tc5PuLSabXWuyznY/PmgIloHexzicKz+011fDshqy/wqY76v/jl+ZTjlc1WhYBW9UU21ZnOz/ZrV5W+LanuV7kVTXvkn1kZFuRdW12vTyxq/s2OFU3hotnxSzf6D5t4L/YJ1LMw12f7EtrZEzZ30V3yVCNTaWam6lqajazUU04yW1EWKVh1Oc7wERlarItXtEqSVLSrVNbWBmrsZVLq6amQzBKMzsguhOwTo9pdrEDupcdzW3/2s0TTbYkZuFL5iocb1RWPMM1Z+XWz/GJmKxzqBzOTys9OqFdZ7i5NLWy0FZ/JF7jRhyqqq0K3HKzYdC3cx04t/YY+Mu4EAN0pPhG6tYqZH6SQoOQmjkkrk5KFTkB4zATnyHc0clQ7ZHxsDNvHvFc9xXbS2miY2gcfjLXdClysGyO4VvV0yPb0obLLURtStwr2r3CDKSu66VsqZdS8efyaeFA+632n8pQo2lnZss4urtF8mhLCxa9Tdx54xK2LW/KzMcPX6lpUKukt/wAbOEmen79LVi5k5H/HZTYStlvGNkCwXWrUq2ppMpnlmbaspzWQ2MrmYlmq7M4G1W5DqrRrq1hyqJkZIIssLHuGI7NK7CTTegnvKJWwdSgsyOrW6j3ES/KLwXiPkHjzLReBHt657SmX49VVfurdli3QRcmwL7iLlPXGyHuOY8q00sU1zAK8811seBzLcN+wd9uuhrIE7LF3VUyFsqyLa3KE83SyuVY+yKlEbEZ3rxLMdCiFruK1MCxxKV3ZYcO2zI7kBBZbO2DkO71qUATuA5NNFC+p1se+ly3P8MjJQwvoC653pLKeTcS47m0YMfiq7iqe5avB6q0aWcd/CNkIMZDxOBeNfgnQO2gWDx0u+MM3AxibaeOExGRqXyFx8oDxqZAYjv7mwVyG/eUkQnqOmdYGsYAKqs7XU9m77lFoOR3CEblyBctm21sjDtPSvcruZaHXySsx6wkFzKMulHNfdxRjlGuzLw91NQ7a4mO5HpwoOXZ3JQdJzHHDVOGZYI9rd5tNP291qOOcu8dCOdmuYBJ7LbD7SjJdWyFEo7hlbMLM2xuyQva4xW4jb02PezDp9qgsWLXZu3ex9ajUhUpqDBvERysxchjQ+bzXXTXRhuWV+PqbldTa2zFR8KCVRrGBBbtu77dm33Nzv+LV2w6cvHLfXSFjUbLcbFTHTP8A/LgYxbWQmyxomXYZfWTNAseQpBDjtmB+29HZqqsvBnuN0nI4wBmLJYazjh8XutU9WSrVZGMt60v4R9JTllWuuVrHdYfA5AWbGkzAjW49GSjK4dfDm8mBuLtZqVtK0raW5K0vfaHpBHH5MKbOD3WB2Ffxx0Vmfw29RXE7qwncrOoW5EtYwCPG8FfvDtCvcvB5vp5jFgAfjb4ZB5ZgAnbINg13TpojOCL7RGZ36eejKqTxtgBNz3I3zHGiYvE3bmYd5X3FqZ4EQT24EaqLatai0ZGTlPU1KvoJwMawpGPkHRr/AHF8smK9gsF5yaK8py2a3PIxeKFXZx2+NijYT9sky4FkJlir2gx1w0iuyix+TM/KVvxex+bBSSyqgrs1KV7l1+KlmOCVbudPm6dqwDtKkIn3B1SJZubIj/4ztmqQCy2s1TFPuMWxkrd7ljEMaaK7IMZUllbBe0Wig6dTrF0wSquwHGTRxwY1AQcfAG5c5WCwgizYtabg1ONcXFMOMxSmolqqeI4WS07tVIEMorxjEw8cSzDKMvMWW5VNMybRdfvz9FiWjDQA2aa3rxnHCykt3bclqB6feRkXjhk47iXZHaX5WGl+XQnxaVKwleLcdMNJ1UR62WfKVIHm+Bpu4x8gtG27a10RjO4mmsBri18v0J/JTN9OfFxmHb5Bvq9KMyzu1uU8k468VjRm1apdZWpsXHrUV+BLG1KyRG+U7QE1oWDlD4iAkujFuBE4ampszkY9HC+moIllprXlEsYTvGC+Llsp99c0vsbgW2V+Rat1gBMxKO/k5Z55VSY6Q3I6XLUVor7zELXWMRQcytrMjt30xv3DSuK65H9Lc+U8GX4d+4xitucUMfXT8/kMoRoGgJBHEsnDta8i1RLD3ei9PuGKqmodV/kOqpysFQ0MQs2JSaXt58il846AsbQsmyweq8us+fBOQSxbDELc/wAZDOrNedd3lCRCy67iid1Z3AZzE5jrloWSjJ7TGhci7PrSpp5n8q0HJf4wjadAzmV+Zg6pod1sYcllVktDarxbwKSyIqOrV4Gp6jSUbfELYjJk7ezhOHyI0ehxLRjdE/kTp9yxtkfdNKjHR9A8eKggjjp9KmoPuCH61qgdVTdA6/R9wJRlNvDyWtnmeZ5nn9HmeZ56+Zszc3Cqmdmue3qhxaTPZUz2VM9lV08TYnx3uep/5ZuBuMrt4zmpgMfQb9ueNK0ssPZlzfETu5XZ91lVLblXiyjKrFtfqCmzO4vEoay+5Rg3X5b5FvjZG5b9xX4E3NXifmInFX4TgYAvM0iVgmnoSZW0dtnp+J+XO6+uNTz9PH10MKrwlF3Bq2Zq/wD0vE8ddzc319T/AJwHqIDLfIg1FjVq2Hvrj94qtiiXkW3Ks4nakpRjUdy3Mf8ArCxM7njfk+Yw8JW+mxgfTzRYkat98jHRQvNtdMS5Uj0L+sVHjym4X+HXHXt0WMFu5icxOXkltRZhZGpub/TubE2Om54/s66eP0+pfqEUO0y6RXgiIORtISn8dK6/FwtK2BanTk5qWHSpWwxcS2zmSV9vrwy8VEZgZS6LHvuQGys1d1Tj1qGjrxh48VUdqY2NdcLcHNrXDxFuoNNcSjZtrXtrXTwYpz2WlyfoUAtXUrZfxjnb9Py3kdKzo47iyrxPE8dNdNH+1vpvpueOm5vpmJ3bL6u1ZKKu8/Srj3CotfIXlj6Mr+w1igowgTcVghqt1Mc8jZ+/QisC7v3Mf9yv1luK/cJJHyaMTuut7TRjmy5v6S4cslbHFrfisalhAA4mPxE41CYdtCpLJdjO2Qks5EOr1wAsWqNA+J9O15XBqNBq4Wmuen0kOfq1AvStDbYQVbfRPLXU9pcN+XTzPP6tTRmpozX6NTX6t7mumY/ae2xrWnpqcZdhlZ2zAp3TWyg/IHwca0CurgF5sofov0lmpTsyrDCtl4pRxaUPqGNkZN749tZrxHaXpbSfuYws5YruczPTWdjvtLvjcj7cruLVtnxucsw7VrqHN+MryLsc+6W2ldWRMasr7cUi+up0wcIK2XZzySaxhVfz8GZfjL/GIP6dgSrVunT06km7Nr45fQeD/LFoNfGeem/0bm+g1NmbM3NzYmxNz8/o5GfjctqrulqqLJUnbqcclccWx153r4SxglZnp4XkCpTL41WEkqdQypSVw6ha61sHy3JzWYd0ZulzLQ162skquryMV1FdmNeFlAWzN9Vp3bQyVUZKN7jUx9uvaAF2RwHkyoFLOIjaMsoOPK24mnK+VuSorL08VzAldlm25bKsJ6c/Kj1AccsEmYgb20zT/SiUJ26c2oWUkTRiDzTVrHWtU68ZomaI/wDRHieJufKa10fy31POtGZA43U2dkYz8qMw/wBPPNRGUe3ZY9kHjolfT09hSGPi9v6vnvICqjXuHtRS7asw4zFnBKz0/a4tmb34cyt6KLjcPT6HEuxPDELEpNkCJTH+TNsHHpuNmYiNSvwgPh7jwN3Jd+HHTxPTnAf1Rf3ZirwxZn/+OPtG+GQf6cwfQG4rEJubm556jzNCa6amprr+ZqDcJ/T+BPE3LRxsMXwpmWh5H6xRrHyv/Hoq5vkEC9X2pOOlN9rZNoq4lfBXBC4oxiJbcUoR+dqsTbXj+4Tt8HXjXZkZPuZUE7mXkC8U5TrT2SYo4z090rvos8VcrKbcBgr0s9NfeZ6cYORjrj2+4AsuVbksYaViSKxqxe2+zrrj8e76oN1UV927XTLTljL9p8UfzUYmuNTcLvBGtzXXxPuAa/T5n101qbmwR9TU876cTPrproZlpp9edGBdTJUurfRyxUe57w5mM1NOYKxKfJf7D+ED3GvHFRW2wQdyw+q39uhBqur+eGWLeoVmvI3ubmuQ7W4PDLaQQOcsxRKqH54/KuMa8mOiJkZCmyoZFlM7p077fHtOi24p1Esl53Y3inHpWyJTysyqPb3VDbeoOBjenD+p348y0Ht0ryYEcRLl4211g4soP7M8w73uGfU3Nz7E2Z8tbM89dzf6PE2YPtra0nuqp7mqe7qEuyFuj1/sNlXE+4umEGK3oa7Au5Rd2ocmp8a3bHH+DGtZT6esFFQC3OsXJqaW3CqvIuORcx4qfvEs4n1NjaypyIxlM9oqQoNhZXWSd8Z3PKWFZVfyqs5KgenINyPWLG7rlvEqbibq/jyMpTkMmvRVCStqKGt435AW+qnHxlmeQ89K/ajfZ3LD+2i/M5AriVXkZ6suTjIpx18Gn/FuBpvz9zYnj9GpvR2ev4+Wvx0104kz3zRnybB7e2dmydm2di6DGt3Vi8sY4aqTXjTHz1x1de5ZYngsZ3Hg2x7JsxllPwWrIWyZGgFu7rNZZWVSlpXi12R8bHSK7I1BD1Li0RuxVPdmyNa8L7nIx2+Jf5C3ylnlbCyLZQGtzSbi3I7iw/ZtYrxifBnuR6RtZ9zUDss3FIMqyaqx72sw5VKrlZAtNbzDsFL0ZitZnBMrFwiprKMLMN/jsTU4w/p+x+YG1Doz8+JrxrwF8zU1DyM/g1d9ZGxoOpnJBO9VKLRY1NXCeo2v7pVBj8FPeIgtrsj4eNZj+1qSJdTQ1eeyoQNUrwXIxucOPZZNcHtByMbiA1VtaRVTj46WOta2Wl7DoGwHpz8s3QHzXuY2samebase64omittedintranscriptdisplaybutpassedinfulk=';

function norm(v){
  return String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/\s+/g,' ').trim();
}

function installStyle(){
  if(document.getElementById('v233-galacticos-style'))return;
  const s=document.createElement('style');
  s.id='v233-galacticos-style';
  s.textContent=`
    .v233-galacticos-rebuilt{
      position:relative!important;
      isolation:isolate!important;
      overflow:hidden!important;
      width:100%!important;
      min-height:440px!important;
      display:flex!important;
      align-items:flex-end!important;
      margin:0!important;
      padding:0!important;
      border:1px solid rgba(77,224,241,.34)!important;
      border-radius:22px!important;
      background:#060653!important;
      box-shadow:0 12px 28px rgba(0,0,55,.18),inset 0 1px 0 rgba(255,255,255,.05)!important;
    }
    .v233-galacticos-rebuilt>.v233-photo{
      position:absolute!important;
      inset:0!important;
      z-index:0!important;
      width:100%!important;
      height:100%!important;
      display:block!important;
      object-fit:cover!important;
      object-position:center 48%!important;
      margin:0!important;
      padding:0!important;
      border:0!important;
      opacity:1!important;
      filter:saturate(1.06) contrast(1.03) brightness(.96)!important;
      transform:none!important;
    }
    .v233-galacticos-rebuilt>.v233-shade{
      position:absolute!important;
      inset:0!important;
      z-index:1!important;
      pointer-events:none!important;
      background:
        linear-gradient(180deg,rgba(2,5,45,.03) 0%,rgba(2,5,45,.08) 28%,rgba(2,5,45,.34) 63%,rgba(2,5,45,.84) 100%),
        linear-gradient(90deg,rgba(2,5,45,.22) 0%,rgba(2,5,45,.04) 70%,rgba(2,5,45,0) 100%)!important;
    }
    .v233-galacticos-rebuilt>.v233-body{
      position:relative!important;
      z-index:2!important;
      width:100%!important;
      padding:20px 18px 19px!important;
      background:transparent!important;
      color:#fff!important;
    }
    .v233-meta{
      display:flex!important;
      align-items:center!important;
      flex-wrap:wrap!important;
      gap:8px!important;
      margin:0 0 11px!important;
    }
    .v233-kind{
      display:inline-flex!important;
      align-items:center!important;
      min-height:27px!important;
      padding:0 10px!important;
      border:1px solid rgba(38,237,246,.58)!important;
      border-radius:999px!important;
      color:#26edf6!important;
      background:rgba(2,7,61,.42)!important;
      font-size:10px!important;
      line-height:1!important;
      font-weight:900!important;
      letter-spacing:.08em!important;
    }
    .v233-date{
      display:inline-flex!important;
      align-items:center!important;
      min-height:27px!important;
      padding:0 10px!important;
      border:1px solid rgba(255,255,255,.24)!important;
      border-radius:999px!important;
      color:#fff!important;
      background:rgba(2,7,61,.48)!important;
      font-size:10px!important;
      line-height:1!important;
      font-weight:850!important;
    }
    .v233-galacticos-rebuilt h3{
      margin:0!important;
      color:#fff!important;
      font-size:clamp(29px,7.8vw,40px)!important;
      line-height:1.02!important;
      font-weight:800!important;
      letter-spacing:-.035em!important;
      text-shadow:0 2px 12px rgba(0,0,0,.78)!important;
    }
    .v233-subtitle{
      display:block!important;
      margin-top:7px!important;
      color:#fff!important;
      font-size:clamp(14px,3.8vw,18px)!important;
      line-height:1.2!important;
      font-weight:760!important;
      text-shadow:0 2px 9px rgba(0,0,0,.76)!important;
    }
    .v233-status{
      display:grid!important;
      grid-template-columns:1fr 1fr!important;
      gap:9px!important;
      margin:13px 0 11px!important;
    }
    .v233-status>span{
      min-width:0!important;
      padding:10px 11px!important;
      border:1px solid rgba(55,231,242,.56)!important;
      border-radius:13px!important;
      background:rgba(3,8,58,.18)!important;
      color:#fff!important;
      font-size:10px!important;
      line-height:1.25!important;
      font-weight:760!important;
      text-shadow:0 2px 8px rgba(0,0,0,.76)!important;
    }
    .v233-status b{
      display:block!important;
      margin-bottom:4px!important;
      color:#26edf6!important;
      font-size:7.7px!important;
      line-height:1!important;
      letter-spacing:.09em!important;
      text-transform:uppercase!important;
    }
    .v233-galacticos-rebuilt p{
      margin:0!important;
      color:#f2f4ff!important;
      font-size:clamp(12px,3.3vw,15px)!important;
      line-height:1.42!important;
      text-shadow:0 2px 9px rgba(0,0,0,.84)!important;
    }
    @media(max-width:420px){
      .v233-galacticos-rebuilt{min-height:420px!important}
    }
    @media(max-width:360px){
      .v233-status{grid-template-columns:1fr!important}
    }
  `;
  document.head.appendChild(s);
}

function isTarget(card){
  if(card?.dataset?.v233Galacticos==='1')return false;
  const heading=norm(card?.querySelector?.('h3,h4')?.textContent||'');
  const all=norm(card?.textContent||'');
  const date=norm(card?.querySelector?.('time,.v35-history-date,.v35-champion-date,.v115-date')?.textContent||'');
  return heading.includes('galacticos de pozos') && (date.includes('09 feb 2025')||all.includes('09 feb 2025'));
}

function rebuild(card){
  const fresh=document.createElement('article');
  fresh.className='v233-galacticos-rebuilt';
  fresh.dataset.v233Galacticos='1';
  fresh.setAttribute('aria-label','Galácticos de Pozos · Campeón de Campeones · 09 feb 2025');
  fresh.innerHTML=
    '<img class="v233-photo" src="'+PHOTO+'" alt="" aria-hidden="true">'+
    '<span class="v233-shade" aria-hidden="true"></span>'+
    '<div class="v233-body">'+
      '<div class="v233-meta"><span class="v233-kind">CAMPEÓN</span><time class="v233-date">09 feb 2025</time></div>'+
      '<h3>Galácticos de Pozos</h3>'+
      '<strong class="v233-subtitle">Campeón de Campeones · Primera Fuerza</strong>'+
      '<div class="v233-status">'+
        '<span><b>Ganador</b>Galácticos de Pozos</span>'+
        '<span><b>Temporada</b>2025</span>'+
      '</div>'+
      '<p>La Liga Municipal de Fútbol “JUVENTINO ROSAS” A.C. felicitó al equipo GALÁCTICOS de Pozos por haber obtenido el cetro de Campeón de Campeones, al imponerse al equipo LINCES el 9 de febrero de 2025.</p>'+
    '</div>';
  card.replaceWith(fresh);
}

function patch(){
  if((location.hash||'').indexOf('history')<0)return;
  installStyle();
  document.querySelectorAll('.v35-history-moment,.v35-champion-card,.v115-card,article').forEach(card=>{
    if(isTarget(card))rebuild(card);
  });
}

let raf=0;
function schedule(){
  cancelAnimationFrame(raf);
  raf=requestAnimationFrame(()=>patch());
}

window.addEventListener('hashchange',()=>setTimeout(schedule,40));
document.addEventListener('click',()=>setTimeout(schedule,90),true);
const screen=document.querySelector('#screen');
if(screen)new MutationObserver(()=>schedule()).observe(screen,{childList:true,subtree:true});
if(document.readyState==='loading'){
  document.addEventListener('DOMContentLoaded',()=>setTimeout(schedule,100),{once:true});
}else{
  setTimeout(schedule,100);
}
setTimeout(schedule,500);
setTimeout(schedule,1200);
})();
