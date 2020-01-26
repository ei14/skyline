//-------------------------------------------------------------------------------------------------------
// Copyright (C) Microsoft. All rights reserved.
// Licensed under the MIT license. See LICENSE.txt file in the project root for full license information.
//-------------------------------------------------------------------------------------------------------
#import "IHaveProperties.h"
#import "IRecieveCollectionChanges.h"
#import "UIElementCollection.h"

@interface StackPanel : UIView <IHaveProperties, IRecieveCollectionChanges>
{
    BOOL _isVertical;
	UIElementCollection* _children;
}

@property UIEdgeInsets padding;

@end
