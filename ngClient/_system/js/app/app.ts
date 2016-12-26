import * as angular from "angular";
import "angular-route";
import "angular-sanitize";
import "angularMoment";
import "angularUtils.directives.dirDisqus";
import "angular-google-analytics";
import "breeze.angular";
import "breeze.directives";
import "highcharts-ng";
import "ui.bootstrap";

import { accountEdit } from "./components/account/accountEdit/accountEdit";
import { accountOverview } from "./components/account/accountOverview/accountOverview";
import { addPassword } from "./components/account/addPassword/addPassword";
import { changeEmail } from "./components/account/changeEmail/changeEmail";
import { changePassword } from "./components/account/changePassword/changePassword";
import { changeUserName } from "./components/account/changeUserName/changeUserName";
import { confirmEmail } from "./components/account/confirmEmail/confirmEmail";
import { login } from "./components/account/login/login";
import { profile } from "./components/account/profile/profile";
import { register } from "./components/account/register/register";
import { resetPassword } from "./components/account/resetPassword/resetPassword";
import { socialLogins } from "./components/account/socialLogins/socialLogins";

import { allInOne } from "./components/content/allInOne";
import { basics } from "./components/content/basics";
import { contributors } from "./components/content/contributors";
import { home } from "./components/content/home";
import { implementation } from "./components/content/implementation";
import { introduction } from "./components/content/introduction";
import { knowledgeIndex } from "./components/content/knowledgeIndex";
import { notFound } from "./components/content/notFound";
import { priorityIndex } from "./components/content/priorityIndex";
import { prologue } from "./components/content/prologue";
import { reason } from "./components/content/reason";
import { totalCostIndex } from "./components/content/totalCostIndex";

import { resourcePoolManage } from "./components/resourcePool/resourcePoolManage";
import { resourcePoolSearch } from "./components/resourcePool/resourcePoolSearch";
import { resourcePoolView } from "./components/resourcePool/resourcePoolView";

import { resourcePoolEditor } from "./components/resourcePoolEditor/resourcePoolEditor";

import { authorizationConfig, authorizationRun, angularInterceptor } from "./config/authorization";
import { breezeConfig, breezeDirectiveConfig } from "./config/breeze";
import { extendHandler } from "./config/exceptionHandlerExtension";
import { analyticsConfig } from "./config/googleAnalytics";
import { routeConfig, routeRun } from "./config/route";

import { defaultController } from "./controllers/default";

import { elementFactory as Element } from "./entities/Element";
import { elementCellFactory as ElementCell } from "./entities/ElementCell";
import { elementFieldFactory as ElementField } from "./entities/ElementField";
import { elementItemFactory as ElementItem } from "./entities/ElementItem";
import { enumsFactory } from "./entities/Enums";
import { resourcePoolFactory as ResourcePool } from "./entities/ResourcePool";

import { applicationFactory } from "./factories/applicationFactory";
import { dataContext } from "./factories/dataContext";
import { entityManagerFactory } from "./factories/entityManagerFactory";
import { locationHistory } from "./factories/locationHistory";
import { logger } from "./factories/logger";
import { resourcePoolFactory } from "./factories/resourcePoolFactory";

import { enumConverter } from "./filters/enumConverter";
import { numberSymbol } from "./filters/numberSymbol";
import { percentage } from "./filters/percentage";

import { settings } from "./settings/settings";

angular.module("main", [
    "angularMoment",
    "angularUtils.directives.dirDisqus",
    "ngRoute",
    "ngSanitize",
    "angular-google-analytics",
    "breeze.angular",
    "breeze.directives",
    "highcharts-ng",
    "ui.bootstrap"
])
    .component("accountEdit", accountEdit)
    .component("accountOverview", accountOverview)
    .component("addPassword", addPassword)
    .component("changeEmail", changeEmail)
    .component("changePassword", changePassword)
    .component("changeUserName", changeUserName)
    .component("confirmEmail", confirmEmail)
    .component("login", login)
    .component("profile", profile)
    .component("register", register)
    .component("resetPassword", resetPassword)
    .component("socialLogins", socialLogins)

    .component("allInOne", allInOne)
    .component("basics", basics)
    .component("contributors", contributors)
    .component("home", home)
    .component("implementation", implementation)
    .component("introduction", introduction)
    .component("knowledgeIndex", knowledgeIndex)
    .component("notFound", notFound)
    .component("priorityIndex", priorityIndex)
    .component("prologue", prologue)
    .component("reason", reason)
    .component("totalCostIndex", totalCostIndex)

    .component("resourcePoolManage", resourcePoolManage)
    .component("resourcePoolSearch", resourcePoolSearch)
    .component("resourcePoolView", resourcePoolView)

    .component("resourcePoolEditor", resourcePoolEditor)

    .config(["$httpProvider", authorizationConfig])
    .config(["breezeProvider", breezeConfig])
    .config(["zDirectivesConfigProvider", breezeDirectiveConfig])
    .config(["$provide", extendHandler])
    .config(["AnalyticsProvider", "settings", analyticsConfig])
    .config(["$locationProvider", "$routeProvider", routeConfig])

    .controller("defaultController", ["applicationFactory", "dataContext", "logger", "settings", "$location", "$rootScope", "$scope", "$uibModal", defaultController])

    .factory("Element", ["logger", "$rootScope", Element])
    .factory("ElementCell", ["logger", ElementCell])
    .factory("ElementField", ["logger", "$rootScope", ElementField])
    .factory("ElementItem", ["logger", ElementItem])
    .factory("Enums", ["logger", enumsFactory])
    .factory("ResourcePool", ["logger", ResourcePool])

    .factory("angularInterceptor", ["logger", "$q", "$window", angularInterceptor])

    .factory("applicationFactory", ["logger", "settings", "$http", "$q", applicationFactory])
    .factory("dataContext", ["entityManagerFactory", "logger", "settings", "$http", "$q", "$rootScope", "$timeout", "$window", dataContext])
    .factory("entityManagerFactory", ["breeze", "Element", "ElementCell", "ElementField", "ElementItem", "logger", "ResourcePool", "settings", entityManagerFactory])
    .factory("locationHistory", ["logger", locationHistory])
    .factory("logger", ["$log", logger])
    .factory("resourcePoolFactory", ["dataContext", "Element", "logger", "ResourcePool", "$rootScope", resourcePoolFactory])

    .filter("enumConverter", ["Enums", "logger", enumConverter])
    .filter("numberSymbol", ["logger", "$filter", numberSymbol])
    .filter("percentage", ["$filter", percentage])

    .constant("settings", settings)

    .run(["logger", "$window", authorizationRun])
    .run(["Analytics", analytics => { }])
    .run(["logger", "$location", "$rootScope", routeRun]);

angular.bootstrap(document.body, ["main"], { strictDi: true });
