import { Component } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Extended, StoreInfo, UserStore, StoreUser } from "../../interfaces/data-models";
import { ActiveStoreService } from "../../providers/AppData/active-store.service";
import { StoreInfoService } from "../../providers/AppData/store-info.service";
import { Router, ActivatedRoute } from "@angular/router";
import { Location } from "@angular/common";
import { switchMap, tap, map, mergeMap } from "rxjs/operators";
import { Observable, from } from "rxjs";
import { AuthService } from "../../providers/Auth/auth.service";
import { UserStoresService } from "../../providers/AppData/user-stores.service";
import {countries, getEmojiFlag, Country as ctry} from "countries-list";
interface Country extends  ctry {
  code: string;
}

@Component({
  selector: "app-edit-store-info",
  templateUrl: "./edit-store-info.page.html",
  styleUrls: ["./edit-store-info.page.scss"]
})
export class EditStoreInfoPage {
  form: FormGroup;
  submitAttempt = false;
  storeDoc: Extended<StoreInfo>;
  storeId: string;
  storeDoc$: Observable<Extended<StoreInfo>>;
  contriesMap: Country[];
  currencies = {
    "AED": "United Arab Emirates Dirham",
    "AFN": "Afghan Afghani",
    "ALL": "Albanian Lek",
    "AMD": "Armenian Dram",
    "ANG": "Netherlands Antillean Guilder",
    "AOA": "Angolan Kwanza",
    "ARS": "Argentine Peso",
    "AUD": "Australian Dollar",
    "AWG": "Aruban Florin",
    "AZN": "Azerbaijani Manat",
    "BAM": "Bosnia-Herzegovina Convertible Mark",
    "BBD": "Barbadian Dollar",
    "BDT": "Bangladeshi Taka",
    "BGN": "Bulgarian Lev",
    "BHD": "Bahraini Dinar",
    "BIF": "Burundian Franc",
    "BMD": "Bermudan Dollar",
    "BND": "Brunei Dollar",
    "BOB": "Bolivian Boliviano",
    "BRL": "Brazilian Real",
    "BSD": "Bahamian Dollar",
    "BTC": "Bitcoin",
    "BTN": "Bhutanese Ngultrum",
    "BWP": "Botswanan Pula",
    "BYN": "Belarusian Ruble",
    "BZD": "Belize Dollar",
    "CAD": "Canadian Dollar",
    "CDF": "Congolese Franc",
    "CHF": "Swiss Franc",
    "CLF": "Chilean Unit of Account (UF)",
    "CLP": "Chilean Peso",
    "CNH": "Chinese Yuan (Offshore)",
    "CNY": "Chinese Yuan",
    "COP": "Colombian Peso",
    "CRC": "Costa Rican Colón",
    "CUC": "Cuban Convertible Peso",
    "CUP": "Cuban Peso",
    "CVE": "Cape Verdean Escudo",
    "CZK": "Czech Republic Koruna",
    "DJF": "Djiboutian Franc",
    "DKK": "Danish Krone",
    "DOP": "Dominican Peso",
    "DZD": "Algerian Dinar",
    "EGP": "Egyptian Pound",
    "ERN": "Eritrean Nakfa",
    "ETB": "Ethiopian Birr",
    "EUR": "Euro",
    "FJD": "Fijian Dollar",
    "FKP": "Falkland Islands Pound",
    "GBP": "British Pound Sterling",
    "GEL": "Georgian Lari",
    "GGP": "Guernsey Pound",
    "GHS": "Ghanaian Cedi",
    "GIP": "Gibraltar Pound",
    "GMD": "Gambian Dalasi",
    "GNF": "Guinean Franc",
    "GTQ": "Guatemalan Quetzal",
    "GYD": "Guyanaese Dollar",
    "HKD": "Hong Kong Dollar",
    "HNL": "Honduran Lempira",
    "HRK": "Croatian Kuna",
    "HTG": "Haitian Gourde",
    "HUF": "Hungarian Forint",
    "IDR": "Indonesian Rupiah",
    "ILS": "Israeli New Sheqel",
    "IMP": "Manx pound",
    "INR": "Indian Rupee",
    "IQD": "Iraqi Dinar",
    "IRR": "Iranian Rial",
    "ISK": "Icelandic Króna",
    "JEP": "Jersey Pound",
    "JMD": "Jamaican Dollar",
    "JOD": "Jordanian Dinar",
    "JPY": "Japanese Yen",
    "KES": "Kenyan Shilling",
    "KGS": "Kyrgystani Som",
    "KHR": "Cambodian Riel",
    "KMF": "Comorian Franc",
    "KPW": "North Korean Won",
    "KRW": "South Korean Won",
    "KWD": "Kuwaiti Dinar",
    "KYD": "Cayman Islands Dollar",
    "KZT": "Kazakhstani Tenge",
    "LAK": "Laotian Kip",
    "LBP": "Lebanese Pound",
    "LKR": "Sri Lankan Rupee",
    "LRD": "Liberian Dollar",
    "LSL": "Lesotho Loti",
    "LYD": "Libyan Dinar",
    "MAD": "Moroccan Dirham",
    "MDL": "Moldovan Leu",
    "MGA": "Malagasy Ariary",
    "MKD": "Macedonian Denar",
    "MMK": "Myanma Kyat",
    "MNT": "Mongolian Tugrik",
    "MOP": "Macanese Pataca",
    "MRO": "Mauritanian Ouguiya (pre-2018)",
    "MRU": "Mauritanian Ouguiya",
    "MUR": "Mauritian Rupee",
    "MVR": "Maldivian Rufiyaa",
    "MWK": "Malawian Kwacha",
    "MXN": "Mexican Peso",
    "MYR": "Malaysian Ringgit",
    "MZN": "Mozambican Metical",
    "NAD": "Namibian Dollar",
    "NGN": "Nigerian Naira",
    "NIO": "Nicaraguan Córdoba",
    "NOK": "Norwegian Krone",
    "NPR": "Nepalese Rupee",
    "NZD": "New Zealand Dollar",
    "OMR": "Omani Rial",
    "PAB": "Panamanian Balboa",
    "PEN": "Peruvian Nuevo Sol",
    "PGK": "Papua New Guinean Kina",
    "PHP": "Philippine Peso",
    "PKR": "Pakistani Rupee",
    "PLN": "Polish Zloty",
    "PYG": "Paraguayan Guarani",
    "QAR": "Qatari Rial",
    "RON": "Romanian Leu",
    "RSD": "Serbian Dinar",
    "RUB": "Russian Ruble",
    "RWF": "Rwandan Franc",
    "SAR": "Saudi Riyal",
    "SBD": "Solomon Islands Dollar",
    "SCR": "Seychellois Rupee",
    "SDG": "Sudanese Pound",
    "SEK": "Swedish Krona",
    "SGD": "Singapore Dollar",
    "SHP": "Saint Helena Pound",
    "SLL": "Sierra Leonean Leone",
    "SOS": "Somali Shilling",
    "SRD": "Surinamese Dollar",
    "SSP": "South Sudanese Pound",
    "STD": "São Tomé and Príncipe Dobra (pre-2018)",
    "STN": "São Tomé and Príncipe Dobra",
    "SVC": "Salvadoran Colón",
    "SYP": "Syrian Pound",
    "SZL": "Swazi Lilangeni",
    "THB": "Thai Baht",
    "TJS": "Tajikistani Somoni",
    "TMT": "Turkmenistani Manat",
    "TND": "Tunisian Dinar",
    "TOP": "Tongan Pa'anga",
    "TRY": "Turkish Lira",
    "TTD": "Trinidad and Tobago Dollar",
    "TWD": "New Taiwan Dollar",
    "TZS": "Tanzanian Shilling",
    "UAH": "Ukrainian Hryvnia",
    "UGX": "Ugandan Shilling",
    "USD": "United States Dollar",
    "UYU": "Uruguayan Peso",
    "UZS": "Uzbekistan Som",
    "VEF": "Venezuelan Bolívar Fuerte (Old)",
    "VES": "Venezuelan Bolívar Soberano",
    "VND": "Vietnamese Dong",
    "VUV": "Vanuatu Vatu",
    "WST": "Samoan Tala",
    "XAF": "CFA Franc BEAC",
    "XAG": "Silver Ounce",
    "XAU": "Gold Ounce",
    "XCD": "East Caribbean Dollar",
    "XDR": "Special Drawing Rights",
    "XOF": "CFA Franc BCEAO",
    "XPD": "Palladium Ounce",
    "XPF": "CFP Franc",
    "XPT": "Platinum Ounce",
    "YER": "Yemeni Rial",
    "ZAR": "South African Rand",
    "ZMW": "Zambian Kwacha",
    "ZWL": "Zimbabwean Dollar"
  };
  currencyKeys = Object.keys(this.currencies);

  constructor(
    private fb: FormBuilder,
    private storesFsRepository: StoreInfoService,
    private activeStoreService: ActiveStoreService,
    private authService: AuthService,
    public router: Router,
    private location: Location,
    public rout: ActivatedRoute
  ) {
    this.form = this.fb.group({
      name: [
        "",
        Validators.compose([Validators.required, Validators.minLength(3)])
      ],
      currency: ["", Validators.compose([Validators.required, Validators.maxLength(3)])],
      code: "",
      users: "",
      creatorId: ""
    });

    this.storeDoc$ = this.rout.paramMap.pipe(
      mergeMap(paramMap => {
        const paramStoreId = paramMap.get("id");
        if (!paramStoreId) {
          const storeDoc = this.activeStoreService.activeStoreKey$.pipe(switchMap(
            activeStoreId => this.storesFsRepository.get(activeStoreId)));
          return storeDoc;
        } else if (paramStoreId === "new") {
          return this.authService.user.pipe(
            map(user => {
              const uid = user.uid;
              const newStoreInfo: StoreInfo = {
                name: "NewStore",
                code: "new",
                users: [uid],
                creatorId : uid
              } as StoreInfo;

              const extNewStore: Extended<StoreInfo> = {
                data: newStoreInfo
              } as Extended<StoreInfo>;
              return extNewStore;
            })
          );
        }
      }),
      tap(str => {
        this.storeDoc = str;
        this.form.patchValue(this.storeDoc.data);
      }));

      // initialize countries map
      const arrs = Object.keys(countries).map(( code) => {
        const currr = countries[code].currency;
        return currr.split(',').map((currency => {
          return {code, ...countries[code], currency};
        }));
      });
      this.contriesMap = [].concat.apply([], arrs);
      console.log(this.contriesMap);
  }

  get nameCtrl() {
    return this.form.get("name");
  }
  get currencyCtrl() {
    return this.form.get("currency");
  }
  dismiss() {
    this.location.back();
  }
  onCancel() {
    this.dismiss();
  }
  onSubmit({ value, valid }: { value: StoreInfo; valid: boolean }) {
    if (valid) {
      const updatedStoreDoc = {
        ...this.storeDoc,
        data: { ...value }
      };
      if (this.storeDoc.id) {
        this.storesFsRepository.saveOld(updatedStoreDoc);
      } else {
        const newId = this.storesFsRepository.newKey();
        this.storesFsRepository.saveNew(updatedStoreDoc, newId);
        // const su: StoreUser = {isAdmin: true,userInfo:}
        const us: UserStore = {storeInfo: {...value, }, status: "OWNER"} as UserStore;
        const eUs: Extended<UserStore> = {data: us, id: newId};
      //   this.uss.saveNew(eUs);
      }
      return this.dismiss();
    }
  }

}
