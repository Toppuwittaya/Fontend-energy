import React from "react";
import { Stage, Layer, Rect, Text, Group, Circle } from "react-konva";

const HomePlan = ({ rooms }) => {
    // const rooms = [
    //     { x: 20, y: 100, width: 200, height: 100, label: "A" },
    //     { x: 220, y: 100, width: 100, height: 100, label: "B" },
    //     { x: 320, y: 100, width: 120, height: 100, label: "C" },
    //     { x: 320, y: 0, width: 120, height: 100, label: "D" },
    //     { x: 440, y: 100, width: 120, height: 200, label: "E" },
    // ];

    return (
        <Stage width={650} height={450}>
            <Layer>
                {rooms.map((room, index) => (
                    <Group key={index}>
                        <Rect
                            x={room.x}
                            y={room.y}
                            width={room.width}
                            height={room.height}
                            stroke="black"
                            strokeWidth={2}
                            fill="rgba(255, 255, 255, 0.12)"
                            cornerRadius={2}
                        />
                        <Text
                            x={room.x + room.width / 5}
                            y={room.y + room.height / 5}
                            text={room.label}
                            fontSize={16}
                            fill="black"
                            fontStyle="bold"
                        />
                        <Circle
                            x={room.x + room.width / 2}
                            y={room.y + room.height / 2}
                            radius={10}
                            fill={room.light ? "yellow" : "lightgrey"}
                            stroke="grey"
                            strokeWidth={2}
                        />
                    </Group>
                ))}
            </Layer>
        </Stage>
    );
};

export default HomePlan;
