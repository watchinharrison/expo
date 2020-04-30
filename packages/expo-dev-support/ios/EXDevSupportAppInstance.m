// Copyright 2015-present 650 Industries. All rights reserved.

#import <React/RCTBridge.h>
#import <React/RCTRootView.h>

#import <EXDevSupport/EXDevSupportAppInstance.h>
#import <EXDevSupport/EXDevSupportInternalModule.h>

@implementation EXDevSupportAppInstance
{
  __strong RCTBridge *_bridge;
}

- (instancetype)init
{
  if (self = [super init]) {
    _bridge = [[RCTBridge alloc] initWithDelegate:self launchOptions:nil];
  }
  return self;
}

#pragma mark - API

- (nonnull RCTBridge *)bridge
{
  return _bridge;
}

#pragma mark - RCTBridgeDelegate

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
  NSBundle *frameworkBundle = [NSBundle bundleForClass:[self class]];
  NSURL *resourcesBundleUrl = [frameworkBundle URLForResource:@"EXDevSupport" withExtension:@"bundle"];

  if (resourcesBundleUrl) {
    NSBundle *resourcesBundle = [NSBundle bundleWithURL:resourcesBundleUrl];
    NSURL *jsUrl = [resourcesBundle URLForResource:@"EXDevMenuApp" withExtension:@"js"];
    return jsUrl;
  }
  return nil;
}

- (NSArray<id<RCTBridgeModule>> *)extraModulesForBridge:(RCTBridge *)bridge
{
  EXDevSupportInternalModule *internalModule = [[EXDevSupportInternalModule alloc] initWithManager:self];
  return @[internalModule];
}

- (BOOL)bridge:(RCTBridge *)bridge didNotFindModule:(NSString *)moduleName
{
  if ([moduleName isEqualToString:@"DevMenu"]) {
    return YES;
  }
  return NO;
}

@end
