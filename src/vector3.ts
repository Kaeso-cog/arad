export class Vector3 {
    constructor(public x: number, public y: number, public z: number) {}

    plus(other: Vector3) {
        return new Vector3(
            this.x + other.x,
            this.y + other.y,
            this.z + other.z
        );
    }
    minus(other: Vector3) {
        return new Vector3(
            this.x - other.x,
            this.y - other.y,
            this.z - other.z
        );
    }
    prod(other: number) {
        return new Vector3(this.x * other, this.y * other, this.z * other);
    }
    div(other: number) {
        return new Vector3(this.x / other, this.y / other, this.z / other);
    }

    dot(other: Vector3) {
        return this.x * other.x + this.y * other.y + this.z * other.z;
    }
    cross(other: Vector3) {
        return new Vector3(
            this.y * other.z - this.z * other.y,
            this.z * other.x - this.x * other.z,
            this.x * other.y - this.y - other.x
        );
    }

    length() {
        return Math.sqrt(this.x ** 2 + this.y ** 2 + this.z ** 2);
    }

    lengthSq() {
        return this.x ** 2 + this.y ** 2 + this.z ** 2;
    }
    angle(other: Vector3) {
        return Math.acos(this.dot(other) / (this.length() * other.length()));
    }
    normalized() {
        return this.div(this.length());
    }

    directionTo(other: Vector3) {
        return other.minus(this).normalized();
    }
    distanceTo(other: Vector3) {
        return other.minus(this).length();
    }
    distanceToSq(other: Vector3) {
        return other.minus(this).lengthSq();
    }

    dupe() {
        return new Vector3(this.x, this.y, this.z);
    }
}

// let a = [1, 2]
// let b = a

// a[0] = 5
//😪
//this is why we have dupe! :)👹
