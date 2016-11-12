function helloWorld(name: string): String {
  return `Hello, ${name}`;
}

export default function greeter(name) { // tslint:disable-line
  return helloWorld(name);
}
