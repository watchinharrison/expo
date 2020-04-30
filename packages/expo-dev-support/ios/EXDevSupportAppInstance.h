// Copyright 2015-present 650 Industries. All rights reserved.

#import <React/RCTBridgeDelegate.h>

#import <EXDevSupport/EXDevSupportBridgeProtocol.h>

@interface EXDevSupportAppInstance : NSObject <RCTBridgeDelegate>

/**
 * Returns React Native bridge instance on which the dev app is running.
 */
- (nonnull id<EXDevSupportBridgeProtocol>)bridge;

@end
