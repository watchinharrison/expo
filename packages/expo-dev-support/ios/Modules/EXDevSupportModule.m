// Copyright 2015-present 650 Industries. All rights reserved.

#import <objc/runtime.h>

#import <EXDevSupport/EXDevSupportBridgeProtocol.h>
#import <EXDevSupport/EXDevSupportModule.h>

@protocol RCTDevSettingsProtocol
- (BOOL)isElementInspectorShown;
- (BOOL)isRemoteDebuggingAvailable;
- (BOOL)isDebuggingRemotely;
- (BOOL)isHotLoadingEnabled;
- (BOOL)isHotLoadingAvailable;
- (BOOL)isPerfMonitorShown;
@end

@implementation EXDevSupportModule

@synthesize bridge = _bridge;

RCT_EXPORT_MODULE(ExpoDevSupport)

+ (BOOL)conformsToProtocol:(Protocol *)protocol
{
  NSString *protocolName = @(protocol_getName(protocol));
  if ([protocolName containsString:@"RCTBridgeModule"]) {
    return YES;
  }
  return [super conformsToProtocol:protocol];
}

#pragma mark - EXDevSupportMenuExtensionProtocol

- (nullable NSArray<EXDevSupportMenuItem *> *)devMenuItems
{
  id<RCTDevSettingsProtocol> devSettings = [self moduleInstanceNamed:@"DevSettings"];
  BOOL isDevModeEnabled = devSettings != nil;//[self _isDevModeEnabledForBridge:bridge];

  if (!isDevModeEnabled) {
    return nil;
  }

  EXDevSupportMenuAction *inspector = [[EXDevSupportMenuAction alloc] initWithId:@"dev-inspector"];
  inspector.isEnabled = devSettings.isElementInspectorShown;
  inspector.label = inspector.isEnabled ? @"Hide Element Inspector" : @"Show Element Inspector";
  inspector.glyphName = @"border-style";

  EXDevSupportMenuAction *remoteDebug = [[EXDevSupportMenuAction alloc] initWithId:@"dev-remote-debug"];
  remoteDebug.isAvailable = devSettings.isRemoteDebuggingAvailable;
  remoteDebug.isEnabled = devSettings.isDebuggingRemotely;
  remoteDebug.label = remoteDebug.isAvailable ? remoteDebug.isEnabled ? @"Stop Remote Debugging" : @"Debug Remote JS" : @"Remote Debugger Unavailable";
  remoteDebug.glyphName = @"remote-desktop";

  EXDevSupportMenuAction *fastRefresh = [[EXDevSupportMenuAction alloc] initWithId:@"dev-hmr"];
  fastRefresh.isAvailable = devSettings.isHotLoadingAvailable;
  fastRefresh.isEnabled = devSettings.isHotLoadingEnabled;
  fastRefresh.label = fastRefresh.isAvailable ? fastRefresh.isEnabled ? @"Disable Fast Refresh" : @"Enable Fast Refresh" : @"Fast Refresh Unavailable";
  fastRefresh.glyphName = @"run-fast";

  id perfMonitorModule = [self moduleInstanceNamed:@"PerfMonitor"];
  EXDevSupportMenuAction *perfMonitor = [[EXDevSupportMenuAction alloc] initWithId:@"dev-perf-monitor"];
  perfMonitor.isAvailable = perfMonitorModule != nil;
  perfMonitor.isEnabled = devSettings.isPerfMonitorShown;
  perfMonitor.label = perfMonitor.isAvailable ? perfMonitor.isEnabled ? @"Hide Performance Monitor" : @"Show Performance Monitor" : @"Performance Monitor Unavailable";
  perfMonitor.glyphName = @"speedometer";

  return @[inspector, remoteDebug, fastRefresh, perfMonitor];
}

#pragma mark - internal

- (id)moduleInstanceNamed:(NSString *)name
{
  id<EXDevSupportModuleDataProvider> bridge = self.bridge;
  return [[bridge moduleDataForName:name] instance];
}

@end
