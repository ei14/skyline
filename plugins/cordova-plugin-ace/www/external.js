//-------------------------------------------------------------------------------------------------------
// Copyright (C) Microsoft. All rights reserved.
// Licensed under the MIT license. See LICENSE.txt file in the project root for full license information.
//-------------------------------------------------------------------------------------------------------

//
// Interacts with external native UI, perhaps from other plugins.
//
module.exports = {
    getPluginAsync: function (serviceName, onSuccess) {
        var pm = new ace.KnownNativeObject("PluginManager");
        pm.invoke("getPlugin", serviceName, function(instance) {
            onSuccess(instance); 
        });
    }
};
