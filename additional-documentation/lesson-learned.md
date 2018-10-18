# Lessons learned

## create a feature module

### circular dependency

I get a `WARNING in Circular dependency detected:` by using `providedIn: RocketModule` instead of using `providers: [ControllerService]`
https://angular.io/guide/providers#providedin-and-ngmodules

Use only providers solve the problem

### Declaretions:

https://angular.io/guide/bootstrapping#the-declarations-array

These declared classes are visible within the module but invisible to components in a different module unless they are exported from this module and the other module imports this one.
