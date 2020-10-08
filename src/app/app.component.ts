import { Component } from "@angular/core";

import { Platform } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";
import { AppRate } from "@ionic-native/app-rate/ngx";

@Component({
  selector: "app-root",
  templateUrl: "app.component.html",
  styleUrls: ["app.component.scss"],
})
export class AppComponent {
  constructor(
    private appRate: AppRate,
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      this.appRate.preferences = {
        displayAppName: "Christian Matching",
        usesUntilPrompt: 4,
        promptAgainForEachNewVersion: true,
        storeAppURL: {
          ios: "",
          android: "",
        },
        customLocale: {
          title: "Do you enjoy %@?",
          message:
            "If you enjoy %@, would you mind taking a moment to rate it?",
          cancelButtonLabel: "No thanks",
          laterButtonLabel: "Remind me later!",
          rateButtonLabel: "Rate It Now",
        },
        callbacks: {
          onRateDialogShow: function (callback) {
            console.log("rate shown");
          },
          onButtonClicked: function (buttonIndex) {
            console.log("selected index: ", buttonIndex);
          },
        },
      };

      this.appRate.promptForRating(true);
    });
  }
}
