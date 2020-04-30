// Copyright 2015-present 650 Industries. All rights reserved.

#import <React/RCTBridgeModule.h>

#import <EXDevSupport/EXDevSupportMenuExtensionProtocol.h>

@interface EXDevSupportModule : NSObject <RCTBridgeModule, EXDevSupportMenuExtensionProtocol>

+ (NSString *)moduleName;

@end
