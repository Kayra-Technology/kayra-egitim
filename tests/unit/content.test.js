import { afterEach, describe, expect, it, vi } from "vitest";
import { allPrograms, findProgram, trainingPrograms, workshops } from "../../src/components/trainingPrograms.js";
import { courseContent, courseFromHash, courseHref } from "../../src/components/courseContent.js";
import { contact, mailto } from "../../src/components/contact.js";

const types = allPrograms.map((program) => program.type);

describe("training catalogue", () => {
  it("lists the four vehicle trainings in intro order", () => {
    expect(trainingPrograms.map((program) => program.type)).toEqual(["uav", "rov", "usv", "rocket"]);
  });

  it("lists the image-processing workshop with its format", () => {
    expect(workshops.map((workshop) => workshop.type)).toEqual(["vision"]);
    expect(workshops[0].format).toBe("1 gün · 4 saat");
  });

  it.each(trainingPrograms)("$type has a real photo and three summary lines", (program) => {
    expect(program.image).toMatch(/^\/images\/kayra-.+\.webp$/);
    expect(program.modules).toHaveLength(3);
  });

  it.each(allPrograms)("$type has a course with 3–6 headline topics", (program) => {
    const course = courseContent[program.type];
    expect(course).toBeDefined();
    expect(course.topics.length).toBeGreaterThanOrEqual(3);
    expect(course.topics.length).toBeLessThanOrEqual(6);
    expect(Array.isArray(course.practice)).toBe(true);
  });

  it("has exactly one course per program and unique slugs", () => {
    expect(Object.keys(courseContent).sort()).toEqual([...types].sort());
    const slugs = Object.values(courseContent).map((course) => course.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("finds programs by type", () => {
    expect(findProgram("vision").name).toBe("Görüntü işlemeye giriş");
    expect(findProgram("rover")).toBeUndefined();
  });
});

describe("contact", () => {
  it("uses the address published on kayra.technology", () => {
    expect(contact.email).toBe("kurumsal@kayra.technology");
    expect(mailto()).toBe("mailto:kurumsal@kayra.technology");
    expect(mailto("ROV eğitimi")).toBe("mailto:kurumsal@kayra.technology?subject=ROV%20e%C4%9Fitimi");
  });
});

describe("course hash routing", () => {
  afterEach(() => vi.unstubAllGlobals());

  const withHash = (hash) => vi.stubGlobal("window", { location: { hash } });

  it("builds hash routes under #/egitim/", () => {
    expect(courseHref("rov")).toBe("#/egitim/sualti");
    expect(courseHref("vision")).toBe("#/egitim/goruntu-isleme");
  });

  it.each(types)("round-trips %s through its hash", (type) => {
    withHash(courseHref(type));
    expect(courseFromHash()).toBe(type);
  });

  it.each(["", "#alanlar", "#/egitim/kara", "#/egitim/bilinmeyen", "#/egitim/sualti/extra"])("returns null for %j", (hash) => {
    withHash(hash);
    expect(courseFromHash()).toBeNull();
  });
});

describe("kit surveys", async () => {
  const { kitSurveys, findKitSurvey } = await import("../../src/components/kitSurveys.js");

  it("covers the UAV and rocket kits and links through the site's short paths", () => {
    expect(kitSurveys.map((kit) => kit.type)).toEqual(["uav", "rocket"]);
    expect(kitSurveys.map((kit) => kit.href)).toEqual(["/anket/iha", "/anket/roket"]);
    kitSurveys.forEach((kit) => expect(trainingPrograms.some((program) => program.type === kit.type)).toBe(true));
    expect(findKitSurvey("rov")).toBeUndefined();
  });
});
