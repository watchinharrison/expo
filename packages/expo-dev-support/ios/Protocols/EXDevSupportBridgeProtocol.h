// Copyright 2015-present 650 Industries. All rights reserved.

@protocol EXDevSupportModuleInstanceProvider

- (id)instance;

@end

@protocol EXDevSupportModuleDataProvider

- (id<EXDevSupportModuleInstanceProvider>)moduleDataForName:(NSString *)moduleName;

@end

@protocol EXDevSupportBridgeProtocol

- (id<EXDevSupportModuleDataProvider>)batchedBridge;

- (NSArray *)modulesConformingToProtocol:(Protocol *)protocol;

@end
