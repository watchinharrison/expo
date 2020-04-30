// Copyright 2015-present 650 Industries. All rights reserved.

#import <React/RCTBridgeModule.h>

#import <EXDevSupport/EXDevSupportManager.h>

@interface EXDevSupportInternalModule : NSObject <RCTBridgeModule>

- (instancetype)initWithManager:(nullable EXDevSupportManager *)manager;

@end
