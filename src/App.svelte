<script lang="ts">
    import p5 from "p5";
    import { Vector3 } from "./vector3";
    import { tweened } from "svelte/motion";
    import { cubicInOut } from "svelte/easing";
    import { naca0015, RAF6 } from "./airfoil";

    const x = tweened(-200, {
        duration: 500,
        easing: cubicInOut,
    });
    const y = tweened(150, {
        duration: 500,
        easing: cubicInOut,
    });
    const z = tweened(-200, {
        duration: 500,
        easing: cubicInOut,
    });
    let ortho = false;

    const sketch = (p: p5) => {
        p.setup = () => {
            p.createCanvas(710, 400, p.WEBGL);
            p.ellipseMode(p.RADIUS);
            p.smooth();
        };

        const rotVec = (v: [number, number], angle): [number, number] => {
            let vP = [v[0] - 0.25, v[1]];
            vP = [
                vP[0] * Math.cos(angle) - vP[1] * Math.sin(angle),
                vP[0] * Math.sin(angle) + vP[1] * Math.cos(angle),
            ];
            return [vP[0] + 0.25, vP[1]];
        };
        const scaleVec = (v: [number, number], scale): [number, number] => [
            (v[0] - 0.25) * scale + 0.25,
            v[1] * scale,
        ];

        const crossProduct = (
            a: [number, number, number],
            b: [number, number, number]
        ): [number, number, number] => [
            a[1] * b[2] - a[2] * b[1],
            a[2] * b[0] - a[0] * b[2],
            a[0] * b[1] - a[1] * b[0],
        ];

        const drawExtrudedMesh = (
            points: [number, number][],
            length: number,
            quality: number,
            scaleRot: (t: number) => [number, number]
        ) => {
            p.push();

            p.translate(-0.25, 0, 0);

            p.beginShape(p.TRIANGLES);

            for (let j = 0; j < points.length; j++) {
                let sr0 = scaleRot(0);
                let sr1 = scaleRot(1);

                let [x01, y01] = scaleVec(rotVec(points[j], sr0[0]), sr0[1]);
                let [x02, y02] = scaleVec(
                    rotVec(points[j < points.length - 1 ? j + 1 : 0], sr0[0]),
                    sr0[1]
                );

                p.normal(new p5.Vector(0, 0, -1));

                p.vertex(x01, y01, 0);
                p.vertex(0.25, 0, 0);
                p.vertex(x02, y02, 0);

                let [x11, y11] = scaleVec(rotVec(points[j], sr1[0]), sr1[1]);
                let [x12, y12] = scaleVec(
                    rotVec(points[j < points.length - 1 ? j + 1 : 0], sr1[0]),
                    sr1[1]
                );
                p.normal(new p5.Vector(0, 0, 1));

                p.vertex(x11, y11, length);
                p.vertex(0.25, 0, length);
                p.vertex(x12, y12, length);
            }

            for (let i = 0; i < quality - 1; i++) {
                let z0 = (length / (quality - 1)) * i;
                let z1 = (length / (quality - 1)) * (i + 1);

                for (let j = 0; j < points.length; j++) {
                    let sr0 = scaleRot(i / (quality - 1));
                    let sr1 = scaleRot((i + 1) / (quality - 1));

                    let [x01, y01] = scaleVec(
                        rotVec(points[j], sr0[0]),
                        sr0[1]
                    );
                    let [x02, y02] = scaleVec(
                        rotVec(
                            points[j < points.length - 1 ? j + 1 : 0],
                            sr0[0]
                        ),
                        sr0[1]
                    );

                    let [x11, y11] = scaleVec(
                        rotVec(points[j], sr1[0]),
                        sr1[1]
                    );
                    let [x12, y12] = scaleVec(
                        rotVec(
                            points[j < points.length - 1 ? j + 1 : 0],
                            sr1[0]
                        ),
                        sr1[1]
                    );

                    let normal1 = crossProduct(
                        [x01 - x02, y01 - y02, z0 - z0],
                        [x11 - x02, y11 - y02, z1 - z0]
                    );

                    p.normal(
                        new p5.Vector(-normal1[0], -normal1[1], -normal1[2])
                    );

                    p.vertex(x01, y01, z0);
                    p.vertex(x02, y02, z0);
                    p.vertex(x11, y11, z1);

                    let normal2 = crossProduct(
                        [x02 - x11, y01 - y11, z0 - z1],
                        [x12 - x11, y12 - y11, z1 - z1]
                    );
                    p.normal(new p5.Vector(normal2[0], normal2[1], normal2[2]));

                    p.vertex(x02, y02, z0);
                    p.vertex(x11, y11, z1);
                    p.vertex(x12, y12, z1);
                }
            }

            p.endShape();

            // for(let )

            p.pop();
            // p.rotateZ(p.map(i, 0, 3, startAngle, endAngle));
            // let s = f(p.map(i, 0, 3, 0, 1));
            // p.scale(s, s, 1);
            // p.translate(-0.25, 0, 0);
        };

        p.draw = () => {
            p.background(0);
            p.camera($x, -$y, $z, 0, 0, 0);

            p.scale(1, -1, 1);

            p.stroke(255, 0, 0);
            p.strokeWeight(2);
            p.line(0, 0, 0, 1000, 0, 0);
            p.stroke(0, 255, 0);
            p.line(0, 0, 0, 0, 1000, 0);
            p.stroke(0, 0, 255);
            p.line(0, 0, 0, 0, 0, 1000);

            p.stroke(255, 50);
            p.strokeWeight(2);
            for (let i = -1000; i <= 1000; i += 100) {
                p.line(-1000, 0, i, 1000, 0, i);
                p.line(i, 0, -1000, i, 0, 1000);
            }
            if (ortho)
                p.ortho(
                    -p.width / 2,
                    p.width / 2,
                    -p.height / 2,
                    p.height / 2,
                    0.01,
                    10000
                );
            else {
                p.perspective();
            }

            p.normalMaterial();
            // p.fill(255);
            // p.stroke(255, 0, 0);
            // p.strokeWeight(2);
            // p.translate(0, p.frameCount, 0);
            p.noStroke();
            p.sphere(30);

            p.scale(50);
            p.rotateY(-p.frameCount * 0.01);
            // p.rotateZ(-p.frameCount * 45.025);
            // p.rotateX(Math.sin(p.frameCount / 20) * 2);

            let n = 4;

            let center = 0.5;

            for (let i = 0; i < n; i++) {
                p.push();
                p.rotateY(((2 * Math.PI) / n) * i);
                p.translate(0, 0, center);
                drawExtrudedMesh(RAF6, 6, 10, (t) => [
                    (p.map(t, 0, 1, -50, -25) * Math.PI) / 180,
                    -1.91667 * t ** 2 + 1.81667 * t + 0.6,
                ]);
                p.pop();
            }
        };
    };
    let range;
    new p5(sketch);
</script>

<button
    on:click={() => {
        x.set(1);
        y.set(750);
        z.set(0);
    }}>top-down</button
>

<button
    on:click={() => {
        x.set(750);
        y.set(0);
        z.set(0);
    }}>back</button
>

<button
    on:click={() => {
        x.set(0);
        y.set(0);
        z.set(-500);
    }}>side</button
>

<button
    on:click={() => {
        x.set(-200);
        y.set(150);
        z.set(-200);
    }}>isometric</button
>

<input type="checkbox" bind:checked={ortho} />
