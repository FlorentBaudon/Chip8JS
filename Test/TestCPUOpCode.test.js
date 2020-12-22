// const CPU = require('./js/CPU.js');
import {CPU} from "../js/CPU.js"
var cpu = new CPU();

test("1nnn - JP address", () => { cpu.ExecuteOpcode(0x1222); expect(cpu.PC).toBe(0x222)} )
test("Addition", () => {expect(cpu.ExecuteOpcode(0x8234)).toBe(5)})
