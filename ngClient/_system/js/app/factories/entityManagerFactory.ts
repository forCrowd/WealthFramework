//import { LoggerService } from "../ng2/services/logger";
import { User } from "../entities/User";
import { UserElementCell } from "../entities/UserElementCell";
import { UserElementField } from "../entities/UserElementField";
import { UserResourcePool } from "../entities/UserResourcePool";

export function entityManagerFactory(breeze: any, Element: any, ElementCell: any, ElementField: any, ElementItem: any, logger: any, ResourcePool: any, settings: any) {

    var serviceRoot = settings.serviceAppUrl;
    var serviceName = serviceRoot + "/odata";
    var factory = {
        newManager: newManager,
        serviceName: serviceName
    };

    return factory;

    function newManager() {
        var manager = new breeze.EntityManager(serviceName);
        var store = manager.metadataStore;

        store.registerEntityTypeCtor("Element", Element);
        store.registerEntityTypeCtor("ElementCell", ElementCell);
        store.registerEntityTypeCtor("ElementField", ElementField);
        store.registerEntityTypeCtor("ElementItem", ElementItem);
        store.registerEntityTypeCtor("ResourcePool", ResourcePool);

        store.registerEntityTypeCtor("User", User);
        store.registerEntityTypeCtor("UserElementCell", UserElementCell);
        store.registerEntityTypeCtor("UserElementField", UserElementField);
        store.registerEntityTypeCtor("UserResourcePool", UserResourcePool);

        return manager;
    }
}
